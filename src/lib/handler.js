import { async } from 'quiver-promise'
import { normalizeHttpHeader } from './normalize'

import { 
  RequestHead, ResponseHead
} from './header'

import {
  pipeStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream
} from 'quiver-stream-util'

export let streamToHttpHandler = streamHandler =>
  (requestHead, requestStreamable) => {
    let args = requestHead.args

    let contentType = requestHead.getHeader('content-type')
    let contentLength = requestHead.getHeader('content-length')

    if(contentType)
      requestStreamable.contentType = contentType

    if(contentLength)
      requestStreamable.contentLength = parseInt(contentLength)

    return streamHandler(args, requestStreamable)
    .then(resultStreamable => {
      let responseHead = new ResponseHead()

      let { 
        contentType, contentLength 
      } = resultStreamable

      if(contentType) {
        responseHead.setHeader('content-type', contentType)
      }

      if(typeof(contentLength) == 'number') {
        responseHead.setHeader('content-length', 
          (contentLength|0).toString())
      }

      return [responseHead, resultStreamable]
    })
  }

export let httpToNodeHandler = httpHandler =>
async(function*(request, response) {
  try {
    let requestHead = new RequestHead({
      httpVersion: request.httpVersion,
      headers: request.headers,
      method: request.method,
      url: request.url
    })

    requestHead.setArgs('clientAddress', 
      request.connection.remoteAddress)

    let requestStreamable = streamToStreamable(
      nodeToQuiverReadStream(request))

    let [responseHead, responseStreamable] = 
      yield httpHandler(requestHead, requestStreamable)


    let headers = responseHead.headers

    for(let key in headers) {
      let normalizedKey = normalizeHttpHeader(key, true)
      response.setHeader(normalizedKey, headers[key])
    }

    response.writeHead(responseHead.statusCode, 
      responseHead.statusMessage)

    if(headers['transfer-encoding'] == 'chunked'){
      response.chunkedEncoding = false
    }

    if(responseStreamable.toNodeStream) {
      let nodeRead = yield responseStreamable.toNodeStream()
      nodeRead.pipe(response)

    } else {
      let responseStream = yield responseStreamable.toStream()
      let responseWrite = nodeToQuiverWriteStream(response)

      pipeStream(responseStream, responseWrite)
    }

  } catch(err) {
    if(!response.headersSents) {
      let errorCode = err.errorCode || 500

      response.writeHead(errorCode, {
        'Content-Length': 0
      })
    }

    response.end()
  }
})