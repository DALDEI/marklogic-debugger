import module namespace functx = "http://www.functx.com"
  at "/MarkLogic/functx/functx-1.0-nodoc-2007-01.xqy";

declare variable $serverId external;

let $a := json:array()
let $_ :=
  for $attached in dbg:attached(xs:unsignedLong($serverId))
  let $status := xdmp:request-status(xdmp:host(), xs:unsignedLong($serverId), $attached)
  let $o := map:new((
    map:entry("server", xdmp:server-name($status/*:server-id)),
    map:entry("host", xdmp:host-name($status/*:host-id)),
    map:entry("modules", if ($status/*:modules = 0) then "FileSystem" else xdmp:database-name($status/*:modules)),
    map:entry("database", if ($status/*:database = 0) then "FileSystem" else xdmp:database-name($status/*:database)),
    for $item in $status/*[fn:not(self::*:server-id or self::*:host-id or self::*:modules or self::*:database)]
    return
      map:entry(functx:words-to-camel-case(fn:replace(fn:local-name($item), "-", " ")), $item/fn:data())
  ))
  return
    json:array-push($a, $o)
return
  xdmp:to-json($a)
