"use strict";
var $__traceur_64_0_46_0_46_8__,
    $__http__,
    $___46__46__47_lib_47_http__,
    $__quiver_45_promise__,
    $__quiver_45_error__,
    $__quiver_45_stream_45_util__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_8__ = require("traceur"), $__traceur_64_0_46_0_46_8__ && $__traceur_64_0_46_0_46_8__.__esModule && $__traceur_64_0_46_0_46_8__ || {default: $__traceur_64_0_46_0_46_8__});
var http = ($__http__ = require("http"), $__http__ && $__http__.__esModule && $__http__ || {default: $__http__}).default;
var $__1 = ($___46__46__47_lib_47_http__ = require("../lib/http"), $___46__46__47_lib_47_http__ && $___46__46__47_lib_47_http__.__esModule && $___46__46__47_lib_47_http__ || {default: $___46__46__47_lib_47_http__}),
    RequestHead = $__1.RequestHead,
    ResponseHead = $__1.ResponseHead,
    httpToNodeHandler = $__1.httpToNodeHandler,
    subrequest = $__1.subrequest,
    getRequest = $__1.getRequest,
    startServer = $__1.startServer;
let createServer = http.createServer;
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
let should = chai.should();
let expect = chai.expect;
let testPort = 8100;
describe('node handler test', (function() {
  it('get request test', async(function*() {
    var $__9,
        $__10;
    let handler = async(function*(requestHead, streamable) {
      requestHead.method.should.equal('GET');
      requestHead.path.should.equal('/get-path');
      requestHead.query.foo.should.equal('bar');
      yield streamableToText(streamable).should.eventually.equal('');
      return [new ResponseHead(), textToStreamable('Hello World')];
    });
    let port = testPort++;
    let server = createServer(httpToNodeHandler(handler)).listen(port);
    let $__8 = yield getRequest('http://localhost:' + port + '/get-path?foo=bar'),
        responseHead = ($__9 = $__8[$traceurRuntime.toProperty(Symbol.iterator)](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
        responseStream = ($__10 = $__9.next()).done ? void 0 : $__10.value;
    responseHead.statusCode.should.equal(200);
    responseHead.statusMessage.should.equal('OK');
    yield streamToText(responseStream).should.eventually.equal('Hello World');
    server.close();
  }));
  it('post request test', async(function*() {
    var $__9,
        $__10;
    let handler = async(function*(requestHead, streamable) {
      requestHead.method.should.equal('POST');
      requestHead.path.should.equal('/post-path');
      requestHead.query.foo.should.equal('bar');
      requestHead.getHeader('Content-Type').should.equal('text/plain');
      yield streamableToText(streamable).should.eventually.equal('Hello');
      return [new ResponseHead(), textToStreamable('Good Bye')];
    });
    let port = testPort++;
    let server = createServer(httpToNodeHandler(handler)).listen(port);
    let requestHead = new RequestHead({
      url: 'http://localhost:' + port + '/post-path?foo=bar',
      method: 'post',
      headers: {'content-type': 'text/plain'}
    });
    let $__8 = yield subrequest(requestHead, textToStream('Hello')),
        responseHead = ($__9 = $__8[$traceurRuntime.toProperty(Symbol.iterator)](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
        responseStream = ($__10 = $__9.next()).done ? void 0 : $__10.value;
    responseHead.statusCode.should.equal(200);
    responseHead.statusMessage.should.equal('OK');
    yield streamToText(responseStream).should.eventually.equal('Good Bye');
    server.close();
  }));
  it('error test', async(function*() {
    var $__9,
        $__10;
    let handler = (function(requestHead, streamable) {
      return reject(error(404, 'Not Found'));
    });
    let port = testPort++;
    let server = createServer(httpToNodeHandler(handler)).listen(port);
    let $__8 = yield getRequest('http://localhost:' + port + '/'),
        responseHead = ($__9 = $__8[$traceurRuntime.toProperty(Symbol.iterator)](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
        responseStream = ($__10 = $__9.next()).done ? void 0 : $__10.value;
    responseHead.statusCode.should.equal(404);
    responseHead.statusMessage.should.equal('Not Found');
    yield streamToText(responseStream).should.eventually.equal('');
    server.close();
  }));
  it('server test', async(function*() {
    var $__9,
        $__10;
    let handler = async(function*(args, streamable) {
      let requestHead = args.requestHead;
      args.path.should.equal('/get-path');
      requestHead.method.should.equal('GET');
      requestHead.query.foo.should.equal('bar');
      yield streamableToText(streamable).should.eventually.equal('');
      return textToStreamable('Hello World');
    });
    let component = {
      isHandlerComponent: true,
      toHandleableBuilder: (function() {
        return (function(config) {
          return ({streamHandler: handler});
        });
      })
    };
    let port = testPort++;
    let config = {serverListen: port};
    let server = yield startServer(component, config);
    let $__8 = yield getRequest('http://localhost:' + port + '/get-path?foo=bar'),
        responseHead = ($__9 = $__8[$traceurRuntime.toProperty(Symbol.iterator)](), ($__10 = $__9.next()).done ? void 0 : $__10.value),
        responseStream = ($__10 = $__9.next()).done ? void 0 : $__10.value;
    responseHead.statusCode.should.equal(200);
    responseHead.statusMessage.should.equal('OK');
    yield streamToText(responseStream).should.eventually.equal('Hello World');
    server.close();
  }));
}));
