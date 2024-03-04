import { server } from './server.js'

const connectionDetails = await server()

console.info(`
Paste the following code into https://codepen.io or simmilar:

(async function main ()  {
  console.info('CLIENT create session')
  const transport = new WebTransport('${connectionDetails.address}', {
    serverCertificateHashes: [${connectionDetails.serverCertificateHashes.map(cert => `{
      algorithm: '${cert.algorithm}',
      value: Uint8Array.from(atob('${btoa(String.fromCodePoint(...cert.value))}'), (m) => m.codePointAt(0))
    }`)}]
  })

  console.info('CLIENT wait for session')
  await transport.ready
  console.info('CLIENT session ready')

  console.info('CLIENT create bidi stream')
  const stream = await transport.createBidirectionalStream()
  const reader = stream.readable.getReader()

  console.info('CLIENT get writer')
  const writer = stream.writable.getWriter()
  console.info('CLIENT wait for writer')
  await writer.ready
  console.info('CLIENT write')
  writer.write(Uint8Array.from([0, 1, 2, 3])).catch(err => {
    console.error('could not write', err)
  })
  console.info('CLIENT close writer')
  await writer.close()

  while (true) {
    console.info('CLIENT read from stream')
    const res = await reader.read()

    console.info('CLIENT got from stream', res)

    if (res.done) {
      console.info('CLIENT read stream finished')
      break
    }
  }
})()
`)

// keep process running
setInterval(() => {}, 1000)
