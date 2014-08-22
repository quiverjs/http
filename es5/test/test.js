"use strict";
require('traceur');
var $__0 = $traceurRuntime.assertObject(require('../lib/head.js')),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead;
var chai = require('chai');
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
  it('request head copy fields test', (function() {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar',
      headers: {'X-Foo': 'Bar'}
    });
    requestHead.getHeader('X-Foo').should.equal('Bar');
    requestHead.getHeader('x-FOO').should.equal('Bar');
    var headers = $traceurRuntime.assertObject(requestHead).headers;
    headers['x-foo'].should.equal('Bar');
    headers['x-foo'] = 'BAZ';
    requestHead.getHeader('X-Foo').should.equal('Bar');
  }));
  it('request head error test', (function() {
    var requestHead = new RequestHead({url: '/api/path?foo=bar'});
    expect((function() {
      return requestHead.setHeader('Foo:', '');
    })).to.throw();
  }));
}));
