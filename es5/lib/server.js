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
var startServer = async($traceurRuntime.initGeneratorFunction(function $__2(component, config) {
  var $__1,
      builder,
      $__0,
      serverListen,
      streamHandler,
      httpHandler,
      handler,
      $__3,
      $__4,
      $__5,
      $__6,
      $__7,
      $__8;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          builder = component.handleableBuilder;
          $__0 = $traceurRuntime.assertObject(config), serverListen = ($__1 = $__0.serverListen) === void 0 ? 8080 : $__1;
          if (!builder)
            throw new Error('Component do not have handleableBuilder');
          if (!config)
            throw new Error('Config is not defined');
          $ctx.state = 12;
          break;
        case 12:
          $__3 = $traceurRuntime.assertObject;
          $__4 = builder(config);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__4;
        case 2:
          $__5 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__6 = $__3.call($traceurRuntime, $__5);
          $__0 = $__6;
          $__7 = $__0.streamHandler;
          streamHandler = $__7;
          $__8 = $__0.httpHandler;
          httpHandler = $__8;
          $ctx.state = 8;
          break;
        case 8:
          if (!httpHandler && !streamHandler)
            throw new Error('Component do not build any valid handler');
          handler = httpHandler ? httpHandler : streamToHttpHandler(streamHandler);
          $ctx.state = 14;
          break;
        case 14:
          $ctx.returnValue = createServer(httpToNodeHandler(handler)).listen(serverListen);
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__2, this);
}));
