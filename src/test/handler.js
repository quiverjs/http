import test from 'tape'
import { createServer } from 'http'

import { asyncTest } from 'quiver-util/tape'
import { RequestHead, ResponseHead } from 'quiver-http-head'
import { streamHandler } from 'quiver-component/constructor'

import {
  httpToNodeHandler,
  startServer,
  subrequest,
  getRequest
} from '../lib'

import { error } from 'quiver-util/error'

import {
  streamableToText, textToStreamable,
  streamToText, textToStream
} from 'quiver-stream-util'

let testPort = 8100

test('node handler test', assert => {
  assert::asyncTest('get request test', async assert => {
    const handler = async (requestHead, streamable) => {
      assert.equal(requestHead.method, 'GET')
      assert.equal(requestHead.pathname, '/get-path')
      assert.equal(requestHead.query.get('foo'), 'bar')

      const requestBody = await streamableToText(streamable)
      assert.equal(requestBody, '')

      const responseHead = new ResponseHead()
      return [responseHead, textToStreamable('Hello World')]
    }

    const port = testPort++
    const server = createServer(httpToNodeHandler(handler))
      .listen(port)

    const [responseHead, responseStreamable] = await getRequest(
      'http://localhost:' + port + '/get-path?foo=bar')

    assert.equal(responseHead.status, '200')

    const responseBody = await streamableToText(responseStreamable)
    assert.equal(responseBody, 'Hello World')

    server.close()
    assert.end()
  })
  return

  assert::asyncTest('post request test', async assert => {
    const handler = async (requestHead, streamable) => {
      assert.equal(requestHead.method, 'POST')
      assert.equal(requestHead.path, '/post-path')
      assert.equal(requestHead.query.foo, 'bar')

      assert.equal(requestHead.getHeader('Content-Type'), 'text/plain')

      const requestBody = await streamableToText(streamable)
      assert.equal(requestBody, 'Hello')

      return [new ResponseHead(), textToStreamable('Good Bye')]
    }

    const port = testPort++
    const server = createServer(httpToNodeHandler(handler))
      .listen(port)

    const requestHead = new RequestHead()
      .setMethod('POST')
      .setHostname('localhost')
      .setPort(port)
      .setPath('/post-path?foo=bar')
      .setHeader('content-type', 'text/plain')

    const [responseHead, responseStream] = await subrequest(
      requestHead, textToStream('Hello'))

    assert.equal(responseHead.status, 200)

    const responseBody = await streamToText(responseStream)
    assert.equal(responseBody, 'Good Bye')

    server.close()
    assert.end()
  })

  assert::asyncTest('error test', async assert => {
    const handler = (requestHead, streamable) =>
      Promise.reject(error(404, 'Not Found'))

    const port = testPort++
    const server = createServer(httpToNodeHandler(handler))
      .listen(port)

    const [responseHead, responseStream] = await getRequest(
      'http://localhost:' + port + '/')

    assert.equal(responseHead.status, 404)

    const responseBody = await streamToText(responseStream)
    assert.equal(responseBody, '')

    server.close()
    assert.end()
  })

  assert::asyncTest('server test', async assert => {
    const component = streamHandler(
      async (args, streamable) => {
        const requestHead = args.get('requestHead')

        assert.equal(args.get('path'), '/get-path')

        assert.equal(requestHead.method, 'GET')
        assert.equal(requestHead.query.get('foo'), 'bar')

        const requestBody = await streamableToText(streamable)
        assert.equal(requestBody, '')

        return textToStreamable('Hello World')
      })

    const port = testPort++
    const config = {
      serverListen: port
    }
    const server = await startServer(component, config)

    const [responseHead, responseStream] = await getRequest(
      'http://localhost:' + port + '/get-path?foo=bar')

    assert.equal(responseHead.status, 200)

    const responseBody = await streamToText(responseStream)
    assert.equal(responseBody, 'Hello World')

    server.close()
    assert.end()
  })
})
