import 'traceur'

import { 
  RequestHead, ResponseHead,
  streamToHttpHandler
} from '../lib/http.js'

import {
  streamableToText, textToStreamable
} from 'quiver-stream-util'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()
var expect = chai.expect

describe('http header test', () => {
  it('request head test 1', () => {
    var requestHead = new RequestHead()

    requestHead.httpVersion.should.equal('1.1')
    requestHead.method.should.equal('GET')
    requestHead.url.should.equal('/')
    requestHead.path.should.equal('/')
    requestHead.queryString.should.equal('')
  })

  it('request head test 2', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar'
    })

    requestHead.path.should.equal('/api/path')
    requestHead.queryString.should.equal('foo=bar')
    requestHead.query.foo.should.equal('bar')
  })

  it('request head test 3', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar'
    })

    requestHead.setQuery('foo', 'baz')

    requestHead.url.should.equal('/api/path?foo=baz')
    requestHead.path.should.equal('/api/path')
    requestHead.queryString.should.equal('foo=baz')
    requestHead.query.foo.should.equal('baz')
  })

  it('request head test 3', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar'
    })

    requestHead.path = '/new-path'


    requestHead.url.should.equal('/new-path?foo=bar')
    requestHead.path.should.equal('/new-path')
    requestHead.queryString.should.equal('foo=bar')
    requestHead.query.foo.should.equal('bar')
  })

  it('request head test 4', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar'
    })

    requestHead.path.should.equal('/api/path')
    requestHead.queryString.should.equal('foo=bar')
    requestHead.query.foo.should.equal('bar')

    requestHead.url = '/new-path?foo=baz'

    requestHead.url.should.equal('/new-path?foo=baz')
    requestHead.path.should.equal('/new-path')
    requestHead.queryString.should.equal('foo=baz')
    requestHead.query.foo.should.equal('baz')
  })

  it('request head test 5', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar'
    })

    requestHead.path.should.equal('/api/path')
    requestHead.queryString.should.equal('foo=bar')
    requestHead.query.foo.should.equal('bar')

    requestHead.queryString = 'bar=foo'
    requestHead.setQuery('baz', 'bar')
    requestHead.url = '/new-path?foo=baz'

    requestHead.url.should.equal('/new-path?foo=baz')
    requestHead.path.should.equal('/new-path')
    requestHead.queryString.should.equal('foo=baz')
    requestHead.query.foo.should.equal('baz')
  })

  it('request head test 6', () => {
    var requestHead = new RequestHead({
      url: 'http://localhost:8080/api/path?foo=bar'
    })

    requestHead.protocol.should.equal('http:')
    requestHead.hostname.should.equal('localhost')
    requestHead.port.should.equal('8080')
    requestHead.path.should.equal('/api/path')
    requestHead.queryString.should.equal('foo=bar')
    requestHead.query.foo.should.equal('bar')
  })

  it('request head copy fields test', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar',
      headers: {
        'X-Foo': 'Bar'
      }
    })

    requestHead.getHeader('X-Foo').should.equal('Bar')
    requestHead.getHeader('x-FOO').should.equal('Bar')

    var { headers } = requestHead
    headers['x-foo'].should.equal('Bar')

    headers['x-foo'] = 'BAZ'

    requestHead.getHeader('X-Foo').should.equal('Bar')
  })

  it('request head args test', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar',
      headers: {
        'X-Foo': 'Bar'
      }
    })

    requestHead.setArgs('foo', 'baz')

    var { args } = requestHead

    args.path.should.equal('/api/path')
    args.foo.should.equal('baz')

    args.requestHead.query.foo.should.equal('bar')
  })

  it('request head error test', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar'
    })

    expect(() => 
      requestHead.setHeader('Foo:', ''))
    .to.throw()
  })

  it('response head test', () => {
    var responseHead = new ResponseHead()

    responseHead.statusCode.should.equal(200)
    responseHead.statusMessage.should.equal('OK')

    responseHead.statusCode = 404
    responseHead.statusMessage = 'Not Found'

    responseHead.statusCode.should.equal(404)
    responseHead.statusMessage.should.equal('Not Found')

    expect(() => 
      responseHead.statusCode = 'string')
    .to.throw()

    expect(() => 
      responseHead.statusMessage = 'New Line\n')
    .to.throw()
  })

  it('handler convert test', () => {
    var streamHandler = (args, streamable) => {
      args.path.should.equal('/api/hello')
      args.requestHead.method.should.equal('POST')

      streamable.contentType.should.equal('text/html')

      args.requestHead.getHeader('content-type')
        .should.equal('text/html')

      return streamableToText(streamable).then(
        (body) => {
          body.should.equal('Hello')
          return textToStreamable('Good Bye')
        })
    }

    var httpHandler = streamToHttpHandler(streamHandler)

    var requestHead = new RequestHead({
      method: 'POST',
      url: '/api/hello?foo=bar'
    })
    .setHeader('content-type', 'text/html')

    return httpHandler(requestHead, textToStreamable('Hello'))
    .then(([responseHead, responseStreamable]) => {
      responseHead.statusCode.should.equal(200)
      responseHead.statusMessage.should.equal('OK')

      responseHead.getHeader('content-type')
        .should.equal('text/plain')

      responseHead.getHeader('content-length')
        .should.equal('8')

      return streamableToText(responseStreamable)
        .should.eventually.equal('Good Bye')
    })
  })
})