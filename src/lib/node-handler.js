import { Map as ImmutableMap } from 'immutable'

import {
  pipeStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream
} from 'quiver-stream-util'

import { nodeRequestToRequestHead } from './convert'
import { pipeStreamableToNodeStream } from './pipe'

export const httpToNodeHandler = httpHandler => {
  const handleRequest = async function(request, response) {
    const requestHead = nodeRequestToRequestHead(request)

    const requestStreamable = streamToStreamable(
      nodeToQuiverReadStream(request))

    const [
      responseHead, responseStreamable
    ] = await httpHandler(requestHead, requestStreamable)

    response.writeHead(responseHead.status, response.headerObject())

    // Disable built in chunked encoding if explicit
    // Transfer-Encoding header is set
    if(responseHead.getHeader('transfer-encoding') === 'chunked')
      response.chunkedEncoding = false

    await pipeStreamableToNodeStream(responseStreamable, response)
  }

  return (request, response) =>
    handleRequest(request, response)
    .catch(err => {
      // Basic terminating of response on error.
      // Graceful error handling should be done in HTTP middlewares
      if(!response.headersSents) {
        response.writeHead(500, {
          'content-length': 0
        })
      }
      response.end()
    })
}
