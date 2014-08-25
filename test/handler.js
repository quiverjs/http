import 'traceur'

import { 
  RequestHead, ResponseHead,
  httpToNodeHandler,
  subrequest, getRequest
} from '../lib/http.js'

import { 
  createServer
} from 'http'

import { async, timeout } from 'quiver-promise'
import { error } from 'quiver-error'

import {
  streamableToText, textToStreamable,
  streamToText, textToStream
} from 'quiver-stream-util'

var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
var should = chai.should()
var expect = chai.expect

var testPort = 8100

describe('node handler test', () => {
  it('get request test', async(function*() {
    var handler = async(function*(requestHead, streamable) {
      requestHead.method.should.equal('GET')
      requestHead.path.should.equal('/get-path')
      requestHead.query.foo.should.equal('bar')

      yield streamableToText(streamable)
        .should.eventually.equal('')

      return [new ResponseHead(), textToStreamable('Hello World')]
    })

    var port = testPort++
    var server = createServer(httpToNodeHandler(handler))
      .listen(port)

    var [responseHead, responseStream] = yield getRequest(
      'http://localhost:' + port +
      '/get-path?foo=bar')

    responseHead.statusCode.should.equal(200)
    responseHead.statusMessage.should.equal('OK')

    yield streamToText(responseStream)
      .should.eventually.equal('Hello World')

    server.close()
  }))

  it('post request test', async(function*() {
    var handler = async(function*(requestHead, streamable) {
      requestHead.method.should.equal('POST')
      requestHead.path.should.equal('/post-path')
      requestHead.query.foo.should.equal('bar')
      requestHead.getHeader('Content-Type').should.equal('text/plain')

      yield streamableToText(streamable)
        .should.eventually.equal('Hello')

      return [new ResponseHead(), textToStreamable('Good Bye')]
    })

    var port = testPort++
    var server = createServer(httpToNodeHandler(handler))
      .listen(port)

    var requestHead = new RequestHead({
      url: 'http://localhost:' + port + '/post-path?foo=bar',
      method: 'post',
      headers: {
        'content-type': 'text/plain'
      }
    })

    var [responseHead, responseStream] = yield subrequest(
      requestHead, textToStream('Hello'))

    responseHead.statusCode.should.equal(200)
    responseHead.statusMessage.should.equal('OK')

    yield streamToText(responseStream)
      .should.eventually.equal('Good Bye')

    server.close()
  }))
})