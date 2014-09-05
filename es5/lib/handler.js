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
var $__header_46_js__,
    $__quiver_45_stream_45_util__;
var $__0 = ($__header_46_js__ = require("./header.js"), $__header_46_js__ && $__header_46_js__.__esModule && $__header_46_js__ || {default: $__header_46_js__}),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead;
var $__1 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    pipeStream = $__1.pipeStream,
    streamToStreamable = $__1.streamToStreamable,
    nodeToQuiverReadStream = $__1.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__1.nodeToQuiverWriteStream;
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
      var $__2 = resultStreamable,
          contentType = $__2.contentType,
          contentLength = $__2.contentLength;
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
    return httpHandler(requestHead, requestStreamable).then((function($__2) {
      var $__3 = $__2,
          responseHead = $__3[0],
          responseStreamable = $__3[1];
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
