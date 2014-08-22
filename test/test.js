import 'traceur'

import { 
  RequestHead, ResponseHead
} from '../lib/head.js'

var chai = require('chai')
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

  it('request head error test', () => {
    var requestHead = new RequestHead({
      url: '/api/path?foo=bar'
    })

    expect(() => 
      requestHead.setHeader('Foo:', ''))
    .to.throw()
  })
})