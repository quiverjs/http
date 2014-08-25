"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/http.js')),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead,
    httpToNodeHandler = $__0.httpToNodeHandler,
    subrequest = $__0.subrequest,
    getRequest = $__0.getRequest,
    startServer = $__0.startServer;
var createServer = $traceurRuntime.assertObject(require('http')).createServer;
var $__0 = $traceurRuntime.assertObject(require('quiver-promise')),
    async = $__0.async,
    timeout = $__0.timeout,
    reject = $__0.reject;
var error = $traceurRuntime.assertObject(require('quiver-error')).error;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    streamableToText = $__0.streamableToText,
    textToStreamable = $__0.textToStreamable,
    streamToText = $__0.streamToText,
    textToStream = $__0.textToStream;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var testPort = 8100;
describe('node handler test', (function() {
  it('get request test', async($traceurRuntime.initGeneratorFunction(function $__1() {
    var handler,
        port,
        server,
        $__0,
        responseHead,
        responseStream,
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
            handler = async($traceurRuntime.initGeneratorFunction(function $__2(requestHead, streamable) {
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
              }, $__2, this);
            }));
            port = testPort++;
            server = createServer(httpToNodeHandler(handler)).listen(port);
            $ctx.state = 14;
            break;
          case 14:
            $__3 = $traceurRuntime.assertObject;
            $__4 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
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
            $__7 = $__0[0];
            responseHead = $__7;
            $__8 = $__0[1];
            responseStream = $__8;
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
    }, $__1, this);
  })));
  it('post request test', async($traceurRuntime.initGeneratorFunction(function $__2() {
    var handler,
        port,
        server,
        requestHead,
        $__0,
        responseHead,
        responseStream,
        $__10,
        $__11,
        $__12,
        $__13,
        $__14,
        $__15,
        $__16;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            handler = async($traceurRuntime.initGeneratorFunction(function $__9(requestHead, streamable) {
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
              }, $__9, this);
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
            $__10 = $traceurRuntime.assertObject;
            $__11 = textToStream('Hello');
            $__12 = subrequest(requestHead, $__11);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__12;
          case 2:
            $__13 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__14 = $__10.call($traceurRuntime, $__13);
            $__0 = $__14;
            $__15 = $__0[0];
            responseHead = $__15;
            $__16 = $__0[1];
            responseStream = $__16;
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
    }, $__2, this);
  })));
  it('error test', async($traceurRuntime.initGeneratorFunction(function $__9() {
    var handler,
        port,
        server,
        $__0,
        responseHead,
        responseStream,
        $__17,
        $__18,
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
            $__17 = $traceurRuntime.assertObject;
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
            $__20 = $__17.call($traceurRuntime, $__19);
            $__0 = $__20;
            $__21 = $__0[0];
            responseHead = $__21;
            $__22 = $__0[1];
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
    }, $__9, this);
  })));
  it('server test', async($traceurRuntime.initGeneratorFunction(function $__23() {
    var handler,
        component,
        port,
        server,
        $__0,
        responseHead,
        responseStream,
        $__25,
        $__26,
        $__27,
        $__28,
        $__29,
        $__30;
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
                      requestHead = $traceurRuntime.assertObject(args).requestHead;
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
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 2;
            return startServer(component, {}, port);
          case 2:
            server = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__25 = $traceurRuntime.assertObject;
            $__26 = getRequest('http://localhost:' + port + '/get-path?foo=bar');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 6;
            return $__26;
          case 6:
            $__27 = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            $__28 = $__25.call($traceurRuntime, $__27);
            $__0 = $__28;
            $__29 = $__0[0];
            responseHead = $__29;
            $__30 = $__0[1];
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
    }, $__23, this);
  })));
}));
