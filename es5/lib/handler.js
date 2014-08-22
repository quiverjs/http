"use strict";
Object.defineProperties(exports, {
  streamToHttpHandler: {get: function() {
      return streamToHttpHandler;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('./head.js')),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead;
var streamToHttpHandler = (function(streamHandler) {
  return (function(requestHead, requestStreamable) {
    var args = requestHead.args;
    return streamHandler(args, requestStreamable).then((function(resultStreamable) {
      var responseHead = new ResponseHead();
      var $__0 = $traceurRuntime.assertObject(resultStreamable),
          contentType = $__0.contentType,
          contentLength = $__0.contentLength;
      if (contentType) {
        responseHead.setHeader('content-type', contentType);
      }
      if (contentLength) {
        responseHead.setHeader('content-length', contentLength);
      }
      return [responseHead, resultStreamable];
    }));
  });
});
