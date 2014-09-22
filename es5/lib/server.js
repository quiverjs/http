"use strict";
Object.defineProperties(exports, {
  startServer: {get: function() {
      return startServer;
    }},
  __esModule: {value: true}
});
var $__http__,
    $__quiver_45_promise__,
    $__handler_46_js__;
var http = ($__http__ = require("http"), $__http__ && $__http__.__esModule && $__http__ || {default: $__http__}).default;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var createServer = http.createServer;
var $__2 = ($__handler_46_js__ = require("./handler.js"), $__handler_46_js__ && $__handler_46_js__.__esModule && $__handler_46_js__ || {default: $__handler_46_js__}),
    httpToNodeHandler = $__2.httpToNodeHandler,
    streamToHttpHandler = $__2.streamToHttpHandler;
var startServer = async($traceurRuntime.initGeneratorFunction(function $__7(component, config) {
  var $__5,
      builder,
      $__4,
      serverListen,
      $__6,
      streamHandler,
      httpHandler,
      handler,
      $__8,
      $__9,
      $__10,
      $__11;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          builder = component.handleableBuilder;
          $__4 = config, serverListen = ($__5 = $__4.serverListen) === void 0 ? 8080 : $__5;
          if (!builder)
            throw new Error('Component do not have handleableBuilder');
          if (!config)
            throw new Error('Config is not defined');
          $ctx.state = 12;
          break;
        case 12:
          $__8 = builder(config);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__8;
        case 2:
          $__9 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__6 = $__9;
          $__10 = $__6.streamHandler;
          streamHandler = $__10;
          $__11 = $__6.httpHandler;
          httpHandler = $__11;
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
  }, $__7, this);
}));
