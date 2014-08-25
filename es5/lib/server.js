"use strict";
Object.defineProperties(exports, {
  startServer: {get: function() {
      return startServer;
    }},
  __esModule: {value: true}
});
var createServer = $traceurRuntime.assertObject(require('http')).createServer;
var async = $traceurRuntime.assertObject(require('quiver-promise')).async;
var httpToNodeHandler = $traceurRuntime.assertObject(require('./handler.js')).httpToNodeHandler;
var startServer = async($traceurRuntime.initGeneratorFunction(function $__1(component, config, listenOptions) {
  var builder,
      handleable,
      handler;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          builder = component.handleableBuilder;
          if (!builder)
            throw new Error('Component do not have handleableBuilder');
          if (!config)
            throw new Error('Config is not defined');
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = 2;
          return builder(config);
        case 2:
          handleable = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          handler = handleable.httpHandler;
          if (!handler)
            throw new Error('Component do not build HTTP handler');
          $ctx.state = 10;
          break;
        case 10:
          $ctx.returnValue = createServer(httpToNodeHandler(handler)).listen(listenOptions);
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__1, this);
}));
