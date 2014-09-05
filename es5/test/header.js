"use strict";
var $__traceur_64_0_46_0_46_58__,
    $___46__46__47_lib_47_http_46_js__,
    $__quiver_45_stream_45_util__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var $__0 = ($___46__46__47_lib_47_http_46_js__ = require("../lib/http.js"), $___46__46__47_lib_47_http_46_js__ && $___46__46__47_lib_47_http_46_js__.__esModule && $___46__46__47_lib_47_http_46_js__ || {default: $___46__46__47_lib_47_http_46_js__}),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead,
    streamToHttpHandler = $__0.streamToHttpHandler;
var $__1 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__1.streamableToText,
    textToStreamable = $__1.textToStreamable;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
describe('http header test', (function() {
  it('request head test 1', (function() {
    var requestHead = new RequestHead();
    requestHead.httpVersion.should.equal('1.1');
    requestHead.method.should.equal('GET');
    requestHead.url.should.equal('/');
    requestHead.path.should.equal('/');
    requestHead.queryString.should.equal('');
  }));
  it('request head test 2', (function() {
    var requestHead = new RequestHead({url: '/api/path?foo=bar'});
    requestHead.path.should.equal('/api/path');
    requestHead.queryString.should.equal('foo=bar');
    requestHead.query.foo.should.equal('bar');
  }));
  it('request head test 3', (function() {
    var requestHead = new RequestHead({url: '/api/path?foo=bar'});
    requestHead.setQuery('foo', 'baz');
    requestHead.url.should.equal('/api/path?foo=baz');
    requestHead.path.should.equal('/api/path');
    requestHead.queryString.should.equal('foo=baz');
    requestHead.query.foo.should.equal('baz');
  }));
  it('request head test 3', (function() {
    var requestHead = new RequestHead({url: '/api/path?foo=bar'});
    requestHead.path = '/new-path';
    requestHead.url.should.equal('/new-path?foo=bar');
    requestHead.path.should.equal('/new-path');
    requestHead.queryString.should.equal('foo=bar');
    requestHead.query.foo.should.equal('bar');
  }));
  it('request head test 4', (function() {
    var requestHead = new RequestHead({url: '/api/path?foo=bar'});
    requestHead.path.should.equal('/api/path');
    requestHead.queryString.should.equal('foo=bar');
    requestHead.query.foo.should.equal('bar');
    requestHead.url = '/new-path?foo=baz';
    requestHead.url.should.equal('/new-path?foo=baz');
    requestHead.path.should.equal('/new-path');
    requestHead.queryString.should.equal('foo=baz');
    requestHead.query.foo.should.equal('baz');
  }));
  it('request head test 5', (function() {
    var requestHead = new RequestHead({url: '/api/path?foo=bar'});
    requestHead.path.should.equal('/api/path');
    requestHead.queryString.should.equal('foo=bar');
    requestHead.query.foo.should.equal('bar');
    requestHead.queryString = 'bar=foo';
    requestHead.setQuery('baz', 'bar');
    requestHead.url = '/new-path?foo=baz';
    requestHead.url.should.equal('/new-path?foo=baz');
    requestHead.path.should.equal('/new-path');
    requestHead.queryString.should.equal('foo=baz');
    requestHead.query.foo.should.equal('baz');
  }));
  it('request head test 6', (function() {
    var requestHead = new RequestHead({url: 'http://localhost:8080/api/path?foo=bar'});
    requestHead.protocol.should.equal('http:');
    requestHead.hostname.should.equal('localhost');
    requestHead.port.should.equal('8080');
    requestHead.path.should.equal('/api/path');
    requestHead.queryString.should.equal('foo=bar');
    requestHead.query.foo.should.equal('bar');
  }));
  it('request head copy fields test', (function() {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar',
      headers: {'X-Foo': 'Bar'}
    });
    requestHead.getHeader('X-Foo').should.equal('Bar');
    requestHead.getHeader('x-FOO').should.equal('Bar');
    var headers = requestHead.headers;
    headers['x-foo'].should.equal('Bar');
    headers['x-foo'] = 'BAZ';
    requestHead.getHeader('X-Foo').should.equal('Bar');
  }));
  it('request head args test', (function() {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar',
      headers: {'X-Foo': 'Bar'}
    });
    requestHead.setArgs('foo', 'baz');
    var args = requestHead.args;
    args.path.should.equal('/api/path');
    args.foo.should.equal('baz');
    args.requestHead.query.foo.should.equal('bar');
  }));
  it('request head error test', (function() {
    var requestHead = new RequestHead({url: '/api/path?foo=bar'});
    expect((function() {
      return requestHead.setHeader('Foo:', '');
    })).to.throw();
  }));
  it('response head test', (function() {
    var responseHead = new ResponseHead();
    responseHead.statusCode.should.equal(200);
    responseHead.statusMessage.should.equal('OK');
    responseHead.statusCode = 404;
    responseHead.statusMessage = 'Not Found';
    responseHead.statusCode.should.equal(404);
    responseHead.statusMessage.should.equal('Not Found');
    expect((function() {
      return responseHead.statusCode = 'string';
    })).to.throw();
    expect((function() {
      return responseHead.statusMessage = 'New Line\n';
    })).to.throw();
  }));
  it('handler convert test', (function() {
    var streamHandler = (function(args, streamable) {
      args.path.should.equal('/api/hello');
      args.requestHead.method.should.equal('POST');
      streamable.contentType.should.equal('text/html');
      args.requestHead.getHeader('content-type').should.equal('text/html');
      return streamableToText(streamable).then((function(body) {
        body.should.equal('Hello');
        return textToStreamable('Good Bye');
      }));
    });
    var httpHandler = streamToHttpHandler(streamHandler);
    var requestHead = new RequestHead({
      method: 'POST',
      url: '/api/hello?foo=bar'
    }).setHeader('content-type', 'text/html');
    return httpHandler(requestHead, textToStreamable('Hello')).then((function($__2) {
      var $__3 = $__2,
          responseHead = $__3[0],
          responseStreamable = $__3[1];
      responseHead.statusCode.should.equal(200);
      responseHead.statusMessage.should.equal('OK');
      responseHead.getHeader('content-type').should.equal('text/plain');
      responseHead.getHeader('content-length').should.equal('8');
      return streamableToText(responseStreamable).should.eventually.equal('Good Bye');
    }));
  }));
}));
