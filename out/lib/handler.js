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
var $__quiver_45_promise__,
    $__normalize__,
    $__header__,
    $__quiver_45_stream_45_util__;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var normalizeHttpHeader = ($__normalize__ = require("./normalize"), $__normalize__ && $__normalize__.__esModule && $__normalize__ || {default: $__normalize__}).normalizeHttpHeader;
var $__2 = ($__header__ = require("./header"), $__header__ && $__header__.__esModule && $__header__ || {default: $__header__}),
    RequestHead = $__2.RequestHead,
    ResponseHead = $__2.ResponseHead;
var $__3 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    pipeStream = $__3.pipeStream,
    streamToStreamable = $__3.streamToStreamable,
    nodeToQuiverReadStream = $__3.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__3.nodeToQuiverWriteStream;
let streamToHttpHandler = (function(streamHandler) {
  return (function(requestHead, requestStreamable) {
    let args = requestHead.args;
    let contentType = requestHead.getHeader('content-type');
    let contentLength = requestHead.getHeader('content-length');
    if (contentType)
      requestStreamable.contentType = contentType;
    if (contentLength)
      requestStreamable.contentLength = parseInt(contentLength);
    return streamHandler(args, requestStreamable).then((function(resultStreamable) {
      let responseHead = new ResponseHead();
      let $__4 = resultStreamable,
          contentType = $__4.contentType,
          contentLength = $__4.contentLength;
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
let httpToNodeHandler = (function(httpHandler) {
  return async(function*(request, response) {
    var $__5,
        $__6;
    try {
      let requestHead = new RequestHead({
        httpVersion: request.httpVersion,
        headers: request.headers,
        method: request.method,
        url: request.url
      });
      requestHead.setArgs('clientAddress', request.connection.remoteAddress);
      let requestStreamable = streamToStreamable(nodeToQuiverReadStream(request));
      let $__4 = yield httpHandler(requestHead, requestStreamable),
          responseHead = ($__5 = $__4[$traceurRuntime.toProperty(Symbol.iterator)](), ($__6 = $__5.next()).done ? void 0 : $__6.value),
          responseStreamable = ($__6 = $__5.next()).done ? void 0 : $__6.value;
      let headers = responseHead.headers;
      for (let key in headers) {
        let normalizedKey = normalizeHttpHeader(key, true);
        response.setHeader(normalizedKey, headers[key]);
      }
      response.writeHead(responseHead.statusCode, responseHead.statusMessage);
      if (headers['transfer-encoding'] == 'chunked') {
        response.chunkedEncoding = false;
      }
      if (responseStreamable.toNodeStream) {
        let nodeRead = yield responseStreamable.toNodeStream();
        nodeRead.pipe(response);
      } else {
        let responseStream = yield responseStreamable.toStream();
        let responseWrite = nodeToQuiverWriteStream(response);
        pipeStream(responseStream, responseWrite);
      }
    } catch (err) {
      if (!response.headersSents) {
        let errorCode = err.errorCode || 500;
        response.writeHead(errorCode, {'Content-Length': 0});
      }
      response.end();
    }
  });
});
