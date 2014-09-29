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
    $__header_46_js__,
    $__quiver_45_stream_45_util__;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var normalizeHttpHeader = ($__normalize__ = require("./normalize"), $__normalize__ && $__normalize__.__esModule && $__normalize__ || {default: $__normalize__}).normalizeHttpHeader;
var $__2 = ($__header_46_js__ = require("./header.js"), $__header_46_js__ && $__header_46_js__.__esModule && $__header_46_js__ || {default: $__header_46_js__}),
    RequestHead = $__2.RequestHead,
    ResponseHead = $__2.ResponseHead;
var $__3 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    pipeStream = $__3.pipeStream,
    streamToStreamable = $__3.streamToStreamable,
    nodeToQuiverReadStream = $__3.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__3.nodeToQuiverWriteStream;
var streamToHttpHandler = (function(streamHandler) {
  return (function(requestHead, requestStreamable) {
    var args = requestHead.args;
    var contentType = requestHead.getHeader('content-type');
    var contentLength = requestHead.getHeader('content-length');
    if (contentType)
      requestStreamable.contentType = contentType;
    if (contentLength)
      requestStreamable.contentLength = parseInt(contentLength);
    return streamHandler(args, requestStreamable).then((function(resultStreamable) {
      var responseHead = new ResponseHead();
      var $__4 = resultStreamable,
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
var httpToNodeHandler = (function(httpHandler) {
  return async($traceurRuntime.initGeneratorFunction(function $__5(request, response) {
    var requestHead,
        requestStreamable,
        $__4,
        responseHead,
        responseStreamable,
        headers,
        $__6,
        $__7,
        $__8,
        $__9,
        key,
        normalizedKey,
        nodeRead,
        responseStream,
        responseWrite,
        errorCode,
        $__10,
        $__11,
        $__12,
        $__13,
        err;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.pushTry(40, null);
            $ctx.state = 43;
            break;
          case 43:
            requestHead = new RequestHead({
              httpVersion: request.httpVersion,
              headers: request.headers,
              method: request.method,
              url: request.url
            });
            requestHead.setArgs('clientAddress', request.connection.remoteAddress);
            requestStreamable = streamToStreamable(nodeToQuiverReadStream(request));
            $ctx.state = 35;
            break;
          case 35:
            $__10 = httpHandler(requestHead, requestStreamable);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__10;
          case 2:
            $__11 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__4 = $__11;
            $__12 = $__4[0];
            responseHead = $__12;
            $__13 = $__4[1];
            responseStreamable = $__13;
            $ctx.state = 8;
            break;
          case 8:
            headers = responseHead.headers;
            $ctx.state = 37;
            break;
          case 37:
            $__6 = [];
            $__7 = headers;
            for ($__8 in $__7)
              $__6.push($__8);
            $ctx.state = 20;
            break;
          case 20:
            $__9 = 0;
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = ($__9 < $__6.length) ? 12 : 16;
            break;
          case 15:
            $__9++;
            $ctx.state = 18;
            break;
          case 12:
            key = $__6[$__9];
            $ctx.state = 13;
            break;
          case 13:
            $ctx.state = (!(key in $__7)) ? 15 : 10;
            break;
          case 10:
            normalizedKey = normalizeHttpHeader(key, true);
            response.setHeader(normalizedKey, headers[key]);
            $ctx.state = 15;
            break;
          case 16:
            response.writeHead(responseHead.statusCode, responseHead.statusMessage);
            if (headers['transfer-encoding'] == 'chunked') {
              response.chunkedEncoding = false;
            }
            $ctx.state = 39;
            break;
          case 39:
            $ctx.state = (responseStreamable.toNodeStream) ? 21 : 27;
            break;
          case 21:
            $ctx.state = 22;
            return responseStreamable.toNodeStream();
          case 22:
            nodeRead = $ctx.sent;
            $ctx.state = 24;
            break;
          case 24:
            nodeRead.pipe(response);
            $ctx.state = 26;
            break;
          case 27:
            $ctx.state = 28;
            return responseStreamable.toStream();
          case 28:
            responseStream = $ctx.sent;
            $ctx.state = 30;
            break;
          case 30:
            responseWrite = nodeToQuiverWriteStream(response);
            pipeStream(responseStream, responseWrite);
            $ctx.state = 26;
            break;
          case 26:
            $ctx.popTry();
            $ctx.state = -2;
            break;
          case 40:
            $ctx.popTry();
            err = $ctx.storedException;
            $ctx.state = 46;
            break;
          case 46:
            if (!response.headersSents) {
              errorCode = err.errorCode || 500;
              response.writeHead(errorCode, {'Content-Length': 0});
            }
            response.end();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  }));
});
