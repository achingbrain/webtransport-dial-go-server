# Dialing webtransport-go using @fails-components/webtransport never completes

Starts a [webtransport-go](https://github.com/quic-go/webtransport-go) echo
server on port 12345.

The server accepts a bidirectional stream, pipes the output to the input, waits
for the stream to end then shuts down.

We use the `@fails-components/webtransport` module to create a WebTransport
client that dials the server, sends a chunk of data using the writer, closes
the writer and reads from the reader.

## Usage

Clone this repo then:

* Install `go1.20` or later
* Install go deps with `go get`
* Install node deps with `npm i`

## Node.js

* Run `npm start`
* Let the example run, you should see something like:

```console
% npm start

> webtransport-go-server@1.0.0 start
> node index.js

SERVER start
SERVER ready
CLIENT create session https://127.0.0.1:12345/echo
CLIENT wait for session
file:///Users/alex/Documents/Workspaces/achingbrain/webtransport-go-server/node_modules/@fails-components/webtransport/lib/client.js:91
          new WebTransportError('Opening handshake failed.')
          ^

WebTransportError: Opening handshake failed.
    at Timeout._onTimeout (file:///Users/alex/Documents/Workspaces/achingbrain/webtransport-go-server/node_modules/@fails-components/webtransport/lib/client.js:91:11)
    at listOnTimeout (node:internal/timers:573:17)
    at process.processTimers (node:internal/timers:514:7) {
  [Symbol(Symbol.toStringTag)]: 'WebTransportError'
}

Node.js v20.11.0
```

The initial handshake never completes. If it did you would expect to see:

```console
% npm start

> webtransport-go-server@1.0.0 start
> node index.js

SERVER start
SERVER ready
CLIENT create session https://127.0.0.1:12345/echo
CLIENT wait for session
CLIENT session ready
CLIENT create bidi stream
CLIENT read from stream
CLIENT got from stream { value: Uint8Array(4) [ 0, 1, 2, 3 ], done: false }
CLIENT read from stream
CLIENT got from stream { done: true }
CLIENT read stream finished
```

## Browsers

To see the code running successfully in a browser run `npm run browser`:

```console
% npm run browser

> webtransport-go-server@1.0.0 browser
> node browser.js

SERVER start
SERVER ready

Paste the following code into https://codepen.io or simmilar:

(async function main ()  {
  console.info('CLIENT create session')

  //...JavaScript here
})()
```

Paste the emitted code into [https://codepen.io](https://codepen.io) or
otherwise run it in a browser and observe the output:

```
"CLIENT create session"
"CLIENT wait for session"
"CLIENT session ready"
"CLIENT create bidi stream"
"CLIENT get writer"
"CLIENT wait for writer"
"CLIENT write"
"CLIENT close writer"
"CLIENT read from stream"
"CLIENT got from stream" // [object Object]
{
  "done": false,
  "value": {
    "0": 0,
    "1": 1,
    "2": 2,
    "3": 3
  }
}
"CLIENT read from stream"
CLIENT read from stream
```
