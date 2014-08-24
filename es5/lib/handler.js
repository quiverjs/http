"use strict";
Object.defineProperties(exports, {
  streamToHttpHandler: {get: function() {
      return streamToHttpHandler;
    }},
  __esModule: {value: true}
});
var $__0 = $traceurRuntime.assertObject(require('./header.js')),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead;
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
