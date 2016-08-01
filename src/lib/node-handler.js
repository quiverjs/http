import {
  streamToStreamable,
  nodeToQuiverReadStream,
  pipeStreamableToNodeStream
} from 'quiver-stream-util'

import { nodeRequestToRequestHead } from './convert'

export const httpToNodeHandler = httpHandler => {
  const handleRequest = async function(request, response) {
    const requestHead = nodeRequestToRequestHead(request)

    const requestStreamable = streamToStreamable(
      nodeToQuiverReadStream(request))

    const [
      responseHead, responseStreamable
    ] = await httpHandler(requestHead, requestStreamable)

    const { status=200 } = responseHead

    response.writeHead(status, responseHead.headerObject())

    // Disable built in chunked encoding if explicit
    // Transfer-Encoding header is set
    if(responseHead.getHeader('transfer-encoding') === 'chunked')
      response.chunkedEncoding = false

    await pipeStreamableToNodeStream(responseStreamable, response)
  }

  return async (request, response) => {
    try {
      await handleRequest(request, response)
    } catch(err) {
      // Basic terminating of response on error.
      // Graceful error handling should be done in HTTP middlewares
      let status = err.code|0
      if(status < 100 || status > 999) {
        status = 500
      }

      if(!response.headersSents) {
        response.writeHead(status, {
          'content-length': 0
        })
      }
      response.end()

      // Throw fatal 500 error to get caught by unhandled rejection handler
      if(status === 500) throw err
    }
  }
}
