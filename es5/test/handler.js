"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__http__,
    $___46__46__47_lib_47_http__,
    $__quiver_45_promise__,
    $__quiver_45_error__,
    $__quiver_45_stream_45_util__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var http = ($__http__ = require("http"), $__http__ && $__http__.__esModule && $__http__ || {default: $__http__}).default;
var $__1 = ($___46__46__47_lib_47_http__ = require("../lib/http"), $___46__46__47_lib_47_http__ && $___46__46__47_lib_47_http__.__esModule && $___46__46__47_lib_47_http__ || {default: $___46__46__47_lib_47_http__}),
    RequestHead = $__1.RequestHead,
    ResponseHead = $__1.ResponseHead,
    httpToNodeHandler = $__1.httpToNodeHandler,
    subrequest = $__1.subrequest,
    getRequest = $__1.getRequest,
    startServer = $__1.startServer;
var createServer = http.createServer;
var $__2 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__2.async,
    timeout = $__2.timeout,
    reject = $__2.reject;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__4 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__4.streamableToText,
    textToStreamable = $__4.textToStreamable,
    streamToText = $__4.streamToText,
    textToStream = $__4.textToStream;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var testPort = 8100;
describe('node handler test', (function() {
  it('get request test', async($traceurRuntime.initGeneratorFunction(function $__9() {
    var handler,
        port,
        server,
        $__8,
        responseHead,
        responseStream,
        $__11,
        $__12,
        $__13,
        $__14;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__10(requestHead, streamable) {
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      requestHead.method.should.equal('GET');
                      requestHead.path.should.equal('/get-path');
                      requestHead.query.foo.should.equal('bar');
                      $ctx.state = 8;
                      break;
                    case 8:
                      $ctx.state = 2;
                      return streamableToText(streamable).should.eventually.equal('');
                    case 2:
                      $ctx.maybeThrow();
                      $ctx.state = 4;
                      break;
                    case 4:
                      $ctx.returnValue = [new ResponseHead(), textToStreamable('Hello World')];
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__10, this);
            }));
            port = testPort++;
            server = createServer(httpToNodeHandler(handler)).listen(port);
            $ctx.state = 14;
            break;
          case 14:
            $__11 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__11;
          case 2:
            $__12 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__8 = $__12;
            $__13 = $__8[0];
            responseHead = $__13;
            $__14 = $__8[1];
            responseStream = $__14;
            $ctx.state = 8;
            break;
          case 8:
            responseHead.statusCode.should.equal(200);
            responseHead.statusMessage.should.equal('OK');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return streamToText(responseStream).should.eventually.equal('Hello World');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = 12;
            break;
          case 12:
            server.close();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__9, this);
  })));
  it('post request test', async($traceurRuntime.initGeneratorFunction(function $__10() {
    var handler,
        port,
        server,
        requestHead,
        $__8,
        responseHead,
        responseStream,
        $__16,
        $__17,
        $__18,
        $__19,
        $__20;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__15(requestHead, streamable) {
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      requestHead.method.should.equal('POST');
                      requestHead.path.should.equal('/post-path');
                      requestHead.query.foo.should.equal('bar');
                      requestHead.getHeader('Content-Type').should.equal('text/plain');
                      $ctx.state = 8;
                      break;
                    case 8:
                      $ctx.state = 2;
                      return streamableToText(streamable).should.eventually.equal('Hello');
                    case 2:
                      $ctx.maybeThrow();
                      $ctx.state = 4;
                      break;
                    case 4:
                      $ctx.returnValue = [new ResponseHead(), textToStreamable('Good Bye')];
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__15, this);
            }));
            port = testPort++;
            server = createServer(httpToNodeHandler(handler)).listen(port);
            requestHead = new RequestHead({
              url: 'http://localhost:' + port + '/post-path?foo=bar',
              method: 'post',
              headers: {'content-type': 'text/plain'}
            });
            $ctx.state = 14;
            break;
          case 14:
            $__16 = textToStream('Hello');
            $__17 = subrequest(requestHead, $__16);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__17;
          case 2:
            $__18 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__8 = $__18;
            $__19 = $__8[0];
            responseHead = $__19;
            $__20 = $__8[1];
            responseStream = $__20;
            $ctx.state = 8;
            break;
          case 8:
            responseHead.statusCode.should.equal(200);
            responseHead.statusMessage.should.equal('OK');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return streamToText(responseStream).should.eventually.equal('Good Bye');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = 12;
            break;
          case 12:
            server.close();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__10, this);
  })));
  it('error test', async($traceurRuntime.initGeneratorFunction(function $__15() {
    var handler,
        port,
        server,
        $__8,
        responseHead,
        responseStream,
        $__21,
        $__22,
        $__23,
        $__24;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = (function(requestHead, streamable) {
              return reject(error(404, 'Not Found'));
            });
            port = testPort++;
            server = createServer(httpToNodeHandler(handler)).listen(port);
            $ctx.state = 14;
            break;
          case 14:
            $__21 = getRequest('http://localhost:' + port + '/');
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__21;
          case 2:
            $__22 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__8 = $__22;
            $__23 = $__8[0];
            responseHead = $__23;
            $__24 = $__8[1];
            responseStream = $__24;
            $ctx.state = 8;
            break;
          case 8:
            responseHead.statusCode.should.equal(404);
            responseHead.statusMessage.should.equal('Not Found');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return streamToText(responseStream).should.eventually.equal('');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = 12;
            break;
          case 12:
            server.close();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__15, this);
  })));
  it('server test', async($traceurRuntime.initGeneratorFunction(function $__25() {
    var handler,
        component,
        port,
        config,
        server,
        $__8,
        responseHead,
        responseStream,
        $__27,
        $__28,
        $__29,
        $__30;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__26(args, streamable) {
              var requestHead;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      requestHead = args.requestHead;
                      args.path.should.equal('/get-path');
                      requestHead.method.should.equal('GET');
                      requestHead.query.foo.should.equal('bar');
                      $ctx.state = 8;
                      break;
                    case 8:
                      $ctx.state = 2;
                      return streamableToText(streamable).should.eventually.equal('');
                    case 2:
                      $ctx.maybeThrow();
                      $ctx.state = 4;
                      break;
                    case 4:
                      $ctx.returnValue = textToStreamable('Hello World');
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__26, this);
            }));
            component = {
              isHandlerComponent: true,
              toHandleableBuilder: (function() {
                return (function(config) {
                  return ({streamHandler: handler});
                });
              })
            };
            port = testPort++;
            config = {serverListen: port};
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 2;
            return startServer(component, config);
          case 2:
            server = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__27 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__27;
          case 6:
            $__28 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__8 = $__28;
            $__29 = $__8[0];
            responseHead = $__29;
            $__30 = $__8[1];
            responseStream = $__30;
            $ctx.state = 12;
            break;
          case 12:
            responseHead.statusCode.should.equal(200);
            responseHead.statusMessage.should.equal('OK');
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 14;
            return streamToText(responseStream).should.eventually.equal('Hello World');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = 16;
            break;
          case 16:
            server.close();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__25, this);
  })));
}));
