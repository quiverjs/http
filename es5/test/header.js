"use strict";
var $__traceur_64_0_46_0_46_7__,
    $___46__46__47_lib_47_http__,
    $___46__46__47_lib_47_normalize__,
    $__quiver_45_stream_45_util__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var $__0 = ($___46__46__47_lib_47_http__ = require("../lib/http"), $___46__46__47_lib_47_http__ && $___46__46__47_lib_47_http__.__esModule && $___46__46__47_lib_47_http__ || {default: $___46__46__47_lib_47_http__}),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead,
    streamToHttpHandler = $__0.streamToHttpHandler;
var $__1 = ($___46__46__47_lib_47_normalize__ = require("../lib/normalize"), $___46__46__47_lib_47_normalize__ && $___46__46__47_lib_47_normalize__.__esModule && $___46__46__47_lib_47_normalize__ || {default: $___46__46__47_lib_47_normalize__}),
    normalizeTable = $__1.normalizeTable,
    normalizeHttpHeader = $__1.normalizeHttpHeader;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamableToText = $__2.streamableToText,
    textToStreamable = $__2.textToStreamable;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
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
    requestHead.getHeader('X-Foo').should.equal('BAZ');
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
    return httpHandler(requestHead, textToStreamable('Hello')).then((function($__5) {
      var $__6 = $__5,
          responseHead = $__6[0],
          responseStreamable = $__6[1];
      responseHead.statusCode.should.equal(200);
      responseHead.statusMessage.should.equal('OK');
      responseHead.getHeader('content-type').should.equal('text/plain');
      responseHead.getHeader('content-length').should.equal('8');
      return streamableToText(responseStreamable).should.eventually.equal('Good Bye');
    }));
  }));
  it('normalize header test', (function() {
    normalizeTable['content-type'].should.equal('Content-Type');
    normalizeHttpHeader('content-type').should.equal('Content-Type');
    should.not.exist(normalizeTable['x-custom-header']);
    normalizeHttpHeader('x-custom-header').should.equal('X-Custom-Header');
    should.not.exist(normalizeTable['x-custom-header']);
    normalizeHttpHeader('x-custom-header', true).should.equal('X-Custom-Header');
    normalizeTable['x-custom-header'].should.equal('X-Custom-Header');
    normalizeHttpHeader('x-custom-header').should.equal('X-Custom-Header');
  }));
}));
