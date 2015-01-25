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
let createServer = http.createServer;
var $__2 = ($__handler_46_js__ = require("./handler.js"), $__handler_46_js__ && $__handler_46_js__.__esModule && $__handler_46_js__ || {default: $__handler_46_js__}),
    httpToNodeHandler = $__2.httpToNodeHandler,
    streamToHttpHandler = $__2.streamToHttpHandler;
let startServer = async(function*(component, config) {
  var $__5;
  if (!component.isHandlerComponent) {
    throw new Error('First argument must be handler component');
  }
  let builder = component.toHandleableBuilder();
  let $__4 = config,
      serverListen = ($__5 = $__4.serverListen) === void 0 ? 8080 : $__5;
  if (!config)
    throw new Error('Config is not defined');
  let $__6 = yield builder(config),
      streamHandler = $__6.streamHandler,
      httpHandler = $__6.httpHandler;
  if (!httpHandler && !streamHandler)
    throw new Error('Component do not build any valid handler');
  let handler = httpHandler ? httpHandler : streamToHttpHandler(streamHandler);
  return createServer(httpToNodeHandler(handler)).listen(serverListen);
});
