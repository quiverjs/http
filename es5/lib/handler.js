"use strict";
Object.defineProperties(exports, {
  streamToHttpHandler: {get: function() {
      return streamToHttpHandler;
    }},
  httpToNodeHandler: {get: function() {
      return httpToNodeHandler;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('./header.js')),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    pipeStream = $__0.pipeStream,
    streamToStreamable = $__0.streamToStreamable,
    nodeToQuiverReadStream = $__0.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__0.nodeToQuiverWriteStream;
var streamToHttpHandler = (function(streamHandler) {
  return (function(requestHead, requestStreamable) {
    var args = requestHead.args;
    var contentType = requestHead.getHeader('content-type');
    var contentLength = requestHead.getHeader('content-length');
    if (contentType)
      requestStreamable.contentType = contentType;
    if (contentLength)
      requestStreamable.contentLength = contentLength;
    return streamHandler(args, requestStreamable).then((function(resultStreamable) {
      var responseHead = new ResponseHead();
      var $__0 = $traceurRuntime.assertObject(resultStreamable),
          contentType = $__0.contentType,
          contentLength = $__0.contentLength;
      if (contentType) {
        responseHead.setHeader('content-type', contentType);
      }
      if (typeof(contentLength) == 'number') {
        responseHead.setHeader('content-length', (contentLength | 0).toString());
      }
      return [responseHead, resultStreamable];
    }));
  });
});
var httpToNodeHandler = (function(httpHandler) {
  return (function(request, response) {
    var requestHead = new RequestHead({
      httpVersion: request.httpVersion,
      headers: request.headers,
      method: request.method,
      url: request.url
    });
    requestHead.setArgs('clientAddress', request.connection.remoteAddress);
    var requestStreamable = streamToStreamable(nodeToQuiverReadStream(request));
    return httpHandler(requestHead, requestStreamable).then((function($__0) {
      var responseHead = $__0[0],
          responseStreamable = $__0[1];
      return responseStreamable.toStream().then((function(responseStream) {
        var headers = responseHead.headers;
        for (var key in headers) {
          response.setHeader(key, headers[key]);
        }
        response.writeHead(responseHead.statusCode, responseHead.statusMessage);
        var responseWrite = nodeToQuiverWriteStream(response);
        return pipeStream(responseStream, responseWrite);
      }));
    })).catch((function(err) {
      if (!response.headersSents) {
        var errorCode = err.errorCode || 500;
        response.writeHead(errorCode, {'Content-Length': 0});
      }
      response.end();
    }));
  });
});
