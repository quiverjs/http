"use strict";
Object.defineProperties(exports, {
  startServer: {get: function() {
      return startServer;
    }},
  __esModule: {value: true}
});
var createServer = $traceurRuntime.assertObject(require('http')).createServer;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var $__0 = $traceurRuntime.assertObject(require('./handler.js')),
    httpToNodeHandler = $__0.httpToNodeHandler,
    streamToHttpHandler = $__0.streamToHttpHandler;
var startServer = async($traceurRuntime.initGeneratorFunction(function $__1(component, config, listenOptions) {
  var builder,
      $__0,
      streamHandler,
      httpHandler,
      handler,
      $__2,
      $__3,
      $__4,
      $__5,
      $__6,
      $__7;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          builder = component.handleableBuilder;
          if (!builder)
            throw new Error('Component do not have handleableBuilder');
          if (!config)
            throw new Error('Config is not defined');
          $ctx.state = 12;
          break;
        case 12:
          $__2 = $traceurRuntime.assertObject;
          $__3 = builder(config);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__3;
        case 2:
          $__4 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__5 = $__2.call($traceurRuntime, $__4);
          $__0 = $__5;
          $__6 = $__0.streamHandler;
          streamHandler = $__6;
          $__7 = $__0.httpHandler;
          httpHandler = $__7;
          $ctx.state = 8;
          break;
        case 8:
          if (!httpHandler && !streamHandler)
            throw new Error('Component do not build any valid handler');
          handler = httpHandler ? httpHandler : streamToHttpHandler(streamHandler);
          $ctx.state = 14;
          break;
        case 14:
          $ctx.returnValue = createServer(httpToNodeHandler(handler)).listen(listenOptions);
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__1, this);
}));
