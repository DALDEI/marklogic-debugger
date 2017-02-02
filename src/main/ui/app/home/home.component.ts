import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import { MarkLogicService } from '../marklogic';
import { Breakpoint } from '../marklogic';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth';
import * as _ from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  appservers: Array<any>;
  selectedServer: any;
  serverFiles: any;
  attached: any;
  currentUri: string;
  currentLine: number;
  currentExpression: string;
  fileText: string;
  breakpoints: Map<string, Array<Breakpoint>>;
  breakpointUris: Array<string>;
  fileBreakpoints: Array<Breakpoint>;
  requestId: any;
  appserverName: any;
  stack: any;
  consoleInput: string;
  consoleOutput: Array<any> = [];

  breakpointsSet: boolean = false;

  codeMirrorConfig = {
    lineNumbers: true,
    indentWithTabs: true,
    lineWrapping: true,
    readOnly: true,
    cursorBlinkRate: 0,
    gutters: ['CodeMirror-linenumbers', 'breakpoints'],
    events: {
      gutterClick: this.gutterClick.bind(this)
    }
  };

  private sub: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private marklogic: MarkLogicService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.appserverName = params['appserverName'];
      this.requestId = params['requestId'];

      this.marklogic.getServers().subscribe((servers: any) => {
        this.appservers = servers;
        if (this.appserverName) {
          let server = _.find(this.appservers, (appserver) => { return appserver.name === this.appserverName; });
          if (server) {
            this.selectedServer = server;
            this.showFiles();
            this.getAttached();
            this.getBreakpoints();
          }
        }

        if (this.requestId) {
          this.getStack(this.requestId);
        }
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }

  getAttached() {
    this.marklogic.getAttached(this.selectedServer.id).subscribe((attached: any) => {
      this.attached = attached;
    });
  }

  getStack(requestId) {
    this.marklogic.getStack(requestId).subscribe((stack: any) => {
      this.stack = stack;
      if (this.stack && this.stack.frames && this.stack.frames.length > 0) {
        const frame = this.stack.frames[0];
        this.showFile(frame.uri, frame.line);

        // if (this.stack.expressions && this.stack.expressions.length > 0) {
        //   const expression: string = this.stack.expressions[0].expressionSource;

        // }
      }
    }, () => {
      this.router.navigate(['server', this.appserverName]);
    });
  }

  debugRequest(requestId) {
    this.router.navigate(['server', this.appserverName, requestId]);
  }

  stepOver() {
    this.setBreakpoints().subscribe(() => {
      this.marklogic.stepOver(this.requestId).subscribe(() => {
        this.getStack(this.requestId);
      });
    });
  }

  stepIn() {
    this.setBreakpoints().subscribe(() => {
      this.marklogic.stepIn(this.requestId).subscribe(() => {
        this.getStack(this.requestId);
      });
    });
  }

  stepOut() {
    this.setBreakpoints().subscribe(() => {
      this.marklogic.stepOut(this.requestId).subscribe(() => {
        this.getStack(this.requestId);
      });
    });
  }

  continue() {
    this.setBreakpoints().subscribe((x: any) => {
      this.marklogic.continue(this.requestId).subscribe(() => {
        this.getStack(this.requestId);
      });
    });
  }

  setBreakpoints() {
    if (!this.breakpointsSet && Object.keys(this.breakpoints).length > 0) {
      this.breakpointsSet = true;
      let breakpoints = new Array<Breakpoint>();
      let keys = Object.keys(this.breakpoints);
      for (let key of keys) {
        for (let bps of this.breakpoints[key]) {
          breakpoints.push(bps);
        }
      }
      return this.marklogic.sendBreakpoints(this.requestId, breakpoints);
    }

    return Observable.of({});
    // const evt: EventEmitter<Response> = new EventEmitter<Response>();// = new Observable<string>();
    // evt.emit(null);
    // return evt;
  }

  gutterClick(cm, line, gutter, clickEvent) {
    console.log('clicked: ' + line);
    const info = cm.lineInfo(line);
    if (info.gutterMarkers) {
      this.marklogic.disableBreakpoint(this.selectedServer.name, this.currentUri, line);
    } else {
      this.marklogic.enableBreakpoint(this.selectedServer.name, this.currentUri, line);
    }
    this.getBreakpoints();
  }

  getBreakpoints() {
    this.breakpoints = this.marklogic.getAllBreakpoints(this.selectedServer.name);
    this.breakpointUris = Object.keys(this.breakpoints);
    if (this.currentUri) {
      this.fileBreakpoints = this.marklogic.getBreakpoints(this.selectedServer.name, this.currentUri);
    } else {
      this.fileBreakpoints = null;
    }
  }

  disableBreakpoint(breakpoint: Breakpoint) {
    this.marklogic.disableBreakpoint(this.selectedServer.name, breakpoint.uri, breakpoint.line);
    this.getBreakpoints();
  }

  toggleConnected(server) {
    return server.connected ? this.enableServer(server) : this.disableServer(server);
  }

  enableServer(server) {
    this.marklogic.enableServer(server.id).subscribe(() => {
      server.connected = true;
    });
  }

  disableServer(server) {
    this.marklogic.disableServer(server.id).subscribe(() => {
      server.connected = false;
    });
  }

  // selectServer(server) {
  //   this.router.navigate(['server', server.name]);
  // }

  showFiles() {
    this.marklogic.getFiles(this.selectedServer.id).subscribe((files: any) => {
      this.serverFiles = files;
      // this.$mdSidenav('left').toggle();
    });
  }

  fileClicked(entry) {
    this.fileBreakpoints = null;
    this.currentLine = null;
    this.marklogic.getFile(this.selectedServer.id, entry.uri).subscribe((txt: any) => {
      this.currentUri = entry.uri;
      this.fileText = txt;
    });
  }

  showFile(uri: string, line: number) {
    this.currentLine = null;
    this.marklogic.getFile(this.selectedServer.id, uri).subscribe((txt: any) => {
      this.currentUri = uri;
      this.fileText = txt;
      this.currentLine = line;

      if (this.stack.expressions && this.stack.expressions.length > 0) {
        this.currentExpression = this.stack.expressions[0].expressionSource;
      }
    });
  }

  consoleKeyPressed($event: KeyboardEvent) {
    if ($event.keyCode === 13) {
      this.consoleOutput.push({
        txt: this.consoleInput,
        type: 'i'
      });
      this.marklogic.valueExpression(this.requestId, this.consoleInput).subscribe((output) => {
        this.consoleOutput.push({
          txt: output,
          type: 'o'
        });
      });
      this.consoleInput = null;
    }
  }

  clearConsole() {
    this.consoleOutput = [];
  }
}