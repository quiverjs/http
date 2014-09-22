"use strict";
var $__traceur_64_0_46_0_46_6__,
    $___46__46__47_lib_47_http_46_js__,
    $__http__,
    $__quiver_45_promise__,
    $__quiver_45_error__,
    $__quiver_45_stream_45_util__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
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
  it('get request test', async($traceurRuntime.initGeneratorFunction(function $__7() {
    var handler,
        port,
        server,
        $__6,
        responseHead,
        responseStream,
        $__9,
        $__10,
        $__11,
        $__12;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__8(requestHead, streamable) {
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
              }, $__8, this);
            }));
            port = testPort++;
            server = createServer(httpToNodeHandler(handler)).listen(port);
            $ctx.state = 14;
            break;
          case 14:
            $__9 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__9;
          case 2:
            $__10 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__6 = $__10;
            $__11 = $__6[0];
            responseHead = $__11;
            $__12 = $__6[1];
            responseStream = $__12;
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
    }, $__7, this);
  })));
  it('post request test', async($traceurRuntime.initGeneratorFunction(function $__8() {
    var handler,
        port,
        server,
        requestHead,
        $__6,
        responseHead,
        responseStream,
        $__14,
        $__15,
        $__16,
        $__17,
        $__18;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__13(requestHead, streamable) {
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
              }, $__13, this);
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
            $__14 = textToStream('Hello');
            $__15 = subrequest(requestHead, $__14);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__15;
          case 2:
            $__16 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__6 = $__16;
            $__17 = $__6[0];
            responseHead = $__17;
            $__18 = $__6[1];
            responseStream = $__18;
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
    }, $__8, this);
  })));
  it('error test', async($traceurRuntime.initGeneratorFunction(function $__13() {
    var handler,
        port,
        server,
        $__6,
        responseHead,
        responseStream,
        $__19,
        $__20,
        $__21,
        $__22;
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
            $__19 = getRequest('http://localhost:' + port + '/');
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__19;
          case 2:
            $__20 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__6 = $__20;
            $__21 = $__6[0];
            responseHead = $__21;
            $__22 = $__6[1];
            responseStream = $__22;
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
    }, $__13, this);
  })));
  it('server test', async($traceurRuntime.initGeneratorFunction(function $__23() {
    var handler,
        component,
        port,
        config,
        server,
        $__6,
        responseHead,
        responseStream,
        $__25,
        $__26,
        $__27,
        $__28;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__24(args, streamable) {
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
              }, $__24, this);
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
            $__25 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__25;
          case 6:
            $__26 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__6 = $__26;
            $__27 = $__6[0];
            responseHead = $__27;
            $__28 = $__6[1];
            responseStream = $__28;
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
    }, $__23, this);
  })));
}));
