# Contributing to MarkLogic Debugger

MarkLogic Debuggers welcomes new contributors. This document will guide you
through the process.

 - [Issues and Bugs](#found-an-issue)
 - [Feature Requests](#want-a-feature)
 - [Building from Source](#building-the-framework-from-source)
 - [Submission Guidelines](#submission-guidelines)
 
## Found an Issue?
If you find a bug in the source code or a mistake in the documentation, you can help us by submitting an issue to our [GitHub Issue Tracker][issue tracker]. Even better you can submit a Pull Request
with a fix for the issue you filed.

## Want a Feature?
You can request a new feature by submitting an issue to our [GitHub Issue Tracker][issue tracker].  If you
would like to implement a new feature then first create a new issue and discuss it with one of our
project maintainers.

## Building the Debugger from Source
Looking to build the code from source? Look no further.

#### Prerequisites
You need these to get started

- Java 8 JDK
- Gradle (the newer the better)
- Node JS 6.5 or newer
- Typings `npm -g install typings`
- A decent IDE. IntelliJ is nice.

#### Building from the command line
To build the war file simply run this command:

```bash
cd /path/to/marklogic-debugger/
gradle build
```

#### Running the Debugger UI from source
Make sure you have the prerequisites installed.

You will need to open two terminal windows.

**Terminal window 1** - This runs the webapp.
```bash
cd /path/to/marklogic-debugger
gradle bootrun
```

**Terminal window 2** - This runs the UI
```
cd /path/to/marklogic-debugger
npm install
npm start
```

Now open your browser to [http://localhost:4200](http://localhost:4200) to use the debug version of the UI.

## Submission Guidelines

### Submitting an Issue
Before you submit your issue search the archive, maybe your question was already answered.

If your issue appears to be a bug, and hasn't been reported, open a new issue.
Help us to maximize the effort we can spend fixing issues and adding new
features, by not reporting duplicate issues. Please fill out the issue template so that your issue can be dealt with quickly.

### Submitting a Pull Request

#### Fork marklogic-debugger

Fork the project [on GitHub](https://github.com/paxtonhare/marklogic-debugger/fork) and clone
your copy.

```sh
$ git clone git@github.com:username/marklogic-debugger.git
$ cd marklogic-debugger
$ git remote add upstream git://github.com/paxtonhare/marklogic-debugger.git
```

We ask that you open an issue in the [issue tracker][] and get agreement from
at least one of the project maintainers before you start coding.

Nothing is more frustrating than seeing your hard work go to waste because
your vision does not align with that of a project maintainer.

#### Create a branch for your changes

Okay, so you have decided to fix something. Create a feature branch
and start hacking. **Note** that we use git flow and thus our most recent changes live on the develop branch.

```sh
$ git checkout -b my-feature-branch -t origin/develop
```

#### Formatting code

We use [.editorconfig][] to configure our editors for proper code formatting. If you don't
use a tool that supports editorconfig be sure to configure your editor to use the settings
equivalent to our .editorconfig file.

#### Commit your changes

Make sure git knows your name and email address:

```sh
$ git config --global user.name "J. Random User"
$ git config --global user.email "j.random.user@example.com"
```

Writing good commit logs is important. A commit log should describe what
changed and why. Follow these guidelines when writing one:

1. The first line should be 50 characters or less and contain a short
   description of the change including the Issue number prefixed by a hash (#).
2. Keep the second line blank.
3. Wrap all other lines at 72 columns.

A good commit log looks like this:

```
Fixing Issue #123: make the whatchamajigger work in MarkLogic 8

Body of commit message is a few lines of text, explaining things
in more detail, possibly giving some background about the issue
being fixed, etc etc.

The body of the commit message can be several paragraphs, and
please do proper word-wrap and keep columns shorter than about
72 characters or so. That way `git log` will show things
nicely even when it is indented.
```

The header line should be meaningful; it is what other people see when they
run `git shortlog` or `git log --oneline`.

#### Rebase your repo

Use `git rebase` (not `git merge`) to sync your work from time to time.

```sh
$ git fetch upstream
$ git rebase upstream/develop
```


#### Test your code

Make sure the JUnit tests pass.

```sh
$ gradle test
```

Make sure that all tests pass. Please, do not submit patches that fail.

#### Push your changes

```sh
$ git push origin my-feature-branch
```

#### Agree to the contributor License

Before we can merge your changes, you need to sign a [Contributor License Agreement](http://developer.marklogic.com/products/cla). You only need to do this once.

#### Submit the pull request

Go to https://github.com/username/marklogic-debugger and select your feature branch. Click
the 'Pull Request' button and fill out the form.

Pull requests are usually reviewed within a few days. If you get comments
that need to be to addressed, apply your changes in a separate commit and push that to your
feature branch. Post a comment in the pull request afterwards; GitHub does
not send out notifications when you add commits to existing pull requests.

That's it! Thank you for your contribution!


#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

* Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

    ```shell
    git push origin --delete my-feature-branch
    ```

* Check out the develop branch:

    ```shell
    git checkout develop -f
    ```

* Delete the local branch:

    ```shell
    git branch -D my-feature-branch
    ```

* Update your develop with the latest upstream version:

    ```shell
    git pull --ff upstream develop
    ```

[issue tracker]: https://github.com/paxtonhare/marklogic-debugger/issues
[.editorconfig]: http://editorconfig.org/
