import 'traceur'
import http from 'http'

import { 
  RequestHead, ResponseHead,
  httpToNodeHandler,
  subrequest, getRequest,
  startServer
} from '../lib/http'

let { createServer } = http

import { async, timeout, reject } from 'quiver-promise'
import { error } from 'quiver-error'

import {
  streamableToText, textToStreamable,
  streamToText, textToStream
} from 'quiver-stream-util'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()
let expect = chai.expect

let testPort = 8100

describe('node handler test', () => {
  it('get request test', async(function*() {
    let handler = async(function*(requestHead, streamable) {
      requestHead.method.should.equal('GET')
      requestHead.path.should.equal('/get-path')
      requestHead.query.foo.should.equal('bar')

      yield streamableToText(streamable)
        .should.eventually.equal('')

      return [new ResponseHead(), textToStreamable('Hello World')]
    })

    let port = testPort++
    let server = createServer(httpToNodeHandler(handler))
      .listen(port)

    let [responseHead, responseStream] = yield getRequest(
      'http://localhost:' + port + '/get-path?foo=bar')

    responseHead.statusCode.should.equal(200)
    responseHead.statusMessage.should.equal('OK')

    yield streamToText(responseStream)
      .should.eventually.equal('Hello World')

    server.close()
  }))

  it('post request test', async(function*() {
    let handler = async(function*(requestHead, streamable) {
      requestHead.method.should.equal('POST')
      requestHead.path.should.equal('/post-path')
      requestHead.query.foo.should.equal('bar')
      requestHead.getHeader('Content-Type').should.equal('text/plain')

      yield streamableToText(streamable)
        .should.eventually.equal('Hello')

      return [new ResponseHead(), textToStreamable('Good Bye')]
    })

    let port = testPort++
    let server = createServer(httpToNodeHandler(handler))
      .listen(port)

    let requestHead = new RequestHead({
      url: 'http://localhost:' + port + '/post-path?foo=bar',
      method: 'post',
      headers: {
        'content-type': 'text/plain'
      }
    })

    let [responseHead, responseStream] = yield subrequest(
      requestHead, textToStream('Hello'))

    responseHead.statusCode.should.equal(200)
    responseHead.statusMessage.should.equal('OK')

    yield streamToText(responseStream)
      .should.eventually.equal('Good Bye')

    server.close()
  }))

  it('error test', async(function*() {
    let handler = (requestHead, streamable) =>
      reject(error(404, 'Not Found'))

    let port = testPort++
    let server = createServer(httpToNodeHandler(handler))
      .listen(port)

    let [responseHead, responseStream] = yield getRequest(
      'http://localhost:' + port + '/')

    responseHead.statusCode.should.equal(404)
    responseHead.statusMessage.should.equal('Not Found')

    yield streamToText(responseStream)
      .should.eventually.equal('')

    server.close()
  }))

  it('server test', async(function*() {
    let handler = async(function*(args, streamable) {
      let { requestHead } = args
      
      args.path.should.equal('/get-path')

      requestHead.method.should.equal('GET')
      requestHead.query.foo.should.equal('bar')

      yield streamableToText(streamable)
        .should.eventually.equal('')

      return textToStreamable('Hello World')
    })

    let component = {
      isHandlerComponent: true,
      toHandleableBuilder: () =>
        config => ({
          streamHandler: handler
        })
    }

    let port = testPort++
    let config = {
      serverListen: port
    }
    let server = yield startServer(component, config)

    let [responseHead, responseStream] = yield getRequest(
      'http://localhost:' + port + '/get-path?foo=bar')

    responseHead.statusCode.should.equal(200)
    responseHead.statusMessage.should.equal('OK')

    yield streamToText(responseStream)
      .should.eventually.equal('Hello World')

    server.close()
  }))
})