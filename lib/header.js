'use strict'

var streamableToResponseHead = function(streamable) {
  var responseHead = {
    statusCode: 200,
    headers: { }
  }

  if(streamable.contentType) {
    responseHead.headers['content-type'] = streamable.contentType
  }

  if(streamable.contentLength) {
    responseHead.headers['content-length'] = streamable.contentLength
  }

  return responseHead
}

module.exports = {
  streamableToResponseHead: streamableToResponseHead
}