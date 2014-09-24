import { normalizeHttpHeader } from './normalize'

import { 
  RequestHead, ResponseHead
} from './header.js'

import {
  pipeStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream
} from 'quiver-stream-util'

export var streamToHttpHandler = streamHandler =>
  (requestHead, requestStreamable) => {
    var args = requestHead.args

    var contentType = requestHead.getHeader('content-type')
    var contentLength = requestHead.getHeader('content-length')

    if(contentType)
      requestStreamable.contentType = contentType

    if(contentLength)
      requestStreamable.contentLength = parseInt(contentLength)

    return streamHandler(args, requestStreamable)
    .then(resultStreamable => {
      var responseHead = new ResponseHead()

      var { 
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

export var httpToNodeHandler = httpHandler =>
  (request, response) => {
    var requestHead = new RequestHead({
      httpVersion: request.httpVersion,
      headers: request.headers,
      method: request.method,
      url: request.url
    })

    requestHead.setArgs('clientAddress', 
      request.connection.remoteAddress)

    var requestStreamable = streamToStreamable(
      nodeToQuiverReadStream(request))

    return httpHandler(requestHead, requestStreamable)
    .then(([responseHead, responseStreamable]) =>
      responseStreamable.toStream()
      .then(responseStream => {
        var headers = responseHead.headers

        for(var key in headers) {
          var normalizedKey = normalizeHttpHeader(key, true)
          response.setHeader(normalizedKey, headers[key])
        }

        response.writeHead(responseHead.statusCode, 
          responseHead.statusMessage)

        var responseWrite = nodeToQuiverWriteStream(response)

        return pipeStream(responseStream, responseWrite)
      }))
    .catch(err => {
      if(!response.headersSents) {
        var errorCode = err.errorCode || 500

        response.writeHead(errorCode, {
          'Content-Length': 0
        })
      }

      response.end()
    })
  }