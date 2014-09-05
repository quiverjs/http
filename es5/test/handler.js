"use strict";
var $__traceur_64_0_46_0_46_58__,
    $___46__46__47_lib_47_http_46_js__,
    $__http__,
    $__quiver_45_promise__,
    $__quiver_45_error__,
    $__quiver_45_stream_45_util__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var $__0 = ($___46__46__47_lib_47_http_46_js__ = require("../lib/http.js"), $___46__46__47_lib_47_http_46_js__ && $___46__46__47_lib_47_http_46_js__.__esModule && $___46__46__47_lib_47_http_46_js__ || {default: $___46__46__47_lib_47_http_46_js__}),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead,
    httpToNodeHandler = $__0.httpToNodeHandler,
    subrequest = $__0.subrequest,
    getRequest = $__0.getRequest,
    startServer = $__0.startServer;
var http = ($__http__ = require("http"), $__http__ && $__http__.__esModule && $__http__ || {default: $__http__}).default;
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
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var testPort = 8100;
describe('node handler test', (function() {
  it('get request test', async($traceurRuntime.initGeneratorFunction(function $__6() {
    var handler,
        port,
        server,
        $__5,
        responseHead,
        responseStream,
        $__8,
        $__9,
        $__10,
        $__11;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__7(requestHead, streamable) {
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
              }, $__7, this);
            }));
            port = testPort++;
            server = createServer(httpToNodeHandler(handler)).listen(port);
            $ctx.state = 14;
            break;
          case 14:
            $__8 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
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
            $__5 = $__9;
            $__10 = $__5[0];
            responseHead = $__10;
            $__11 = $__5[1];
            responseStream = $__11;
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
    }, $__6, this);
  })));
  it('post request test', async($traceurRuntime.initGeneratorFunction(function $__7() {
    var handler,
        port,
        server,
        requestHead,
        $__5,
        responseHead,
        responseStream,
        $__13,
        $__14,
        $__15,
        $__16,
        $__17;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__12(requestHead, streamable) {
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
              }, $__12, this);
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
            $__13 = textToStream('Hello');
            $__14 = subrequest(requestHead, $__13);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__14;
          case 2:
            $__15 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__5 = $__15;
            $__16 = $__5[0];
            responseHead = $__16;
            $__17 = $__5[1];
            responseStream = $__17;
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
    }, $__7, this);
  })));
  it('error test', async($traceurRuntime.initGeneratorFunction(function $__12() {
    var handler,
        port,
        server,
        $__5,
        responseHead,
        responseStream,
        $__18,
        $__19,
        $__20,
        $__21;
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
            $__18 = getRequest('http://localhost:' + port + '/');
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__18;
          case 2:
            $__19 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__5 = $__19;
            $__20 = $__5[0];
            responseHead = $__20;
            $__21 = $__5[1];
            responseStream = $__21;
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
    }, $__12, this);
  })));
  it('server test', async($traceurRuntime.initGeneratorFunction(function $__22() {
    var handler,
        component,
        port,
        config,
        server,
        $__5,
        responseHead,
        responseStream,
        $__24,
        $__25,
        $__26,
        $__27;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__23(args, streamable) {
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
              }, $__23, this);
            }));
            component = {handleableBuilder: (function(config) {
                return ({streamHandler: handler});
              })};
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
            $__24 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__24;
          case 6:
            $__25 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__5 = $__25;
            $__26 = $__5[0];
            responseHead = $__26;
            $__27 = $__5[1];
            responseStream = $__27;
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
    }, $__22, this);
  })));
}));
