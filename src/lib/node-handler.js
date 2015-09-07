import { Map as ImmutableMap } from 'immutable'

import {
  pipeStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream
} from 'quiver-stream-util'

const headerEntries = function*(request) {
  for(let key of Object.keys(request.headers)) {
    yield [key, headers[key]]
  }

  yield [':scheme', 'http']
  yield [':method', request.method]
  yield [':path', request.url]
  yield [':remote-address', request.connection.remoteAddress]
}

export const httpToNodeHandler = httpHandler => {
  const handleRequest = async function(request, response) {
    const requestHead = new RequestHead(headerEntries(request))

    const requestStreamable = streamToStreamable(
      nodeToQuiverReadStream(request))

    const [
      responseHead, responseStreamable
    ] = await httpHandler(requestHead, requestStreamable)

    for(let [key, value] of responseHead.entries()) {
      response.setHeader(key, value)
    }

    response.writeHead(responseHead.status)

    if(responseHead.getHeader('transfer-encoding') === 'chunked')
      response.chunkedEncoding = false

    if(responseStreamable.toNodeStream) {
      const nodeRead = await responseStreamable.toNodeStream()
      nodeRead.pipe(response)

    } else {
      const responseStream = await responseStreamable.toStream()
      const responseWrite = nodeToQuiverWriteStream(response)

      pipeStream(responseStream, responseWrite)
    }
  }

  return (request, response) =>
    handleRequest(request, response)
    .catch(err => {
      if(!response.headersSents) {
        response.writeHead(500, {
          'Content-Length': 0
        })
      }
      response.end()
    })
}
