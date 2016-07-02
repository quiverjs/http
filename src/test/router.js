import test from 'tape'

import { asyncTest } from 'quiver-util/tape'
import { RequestHead } from 'quiver-http-head'

import { createConfig } from 'quiver-component/util'

import {
  simpleHandler, httpHandler,
  httpRouter, streamRouter
} from 'quiver-component/constructor'

import {
  startServer, subrequest
} from '../lib'

import {
  streamableToText, textToStreamable,
  emptyStreamable, closeStreamable
} from 'quiver-stream-util'

const testPort = 8200

test('integrated router components test', assert => {
  assert::asyncTest('communicate to Node server through network', async assert => {
    const staticHandler = simpleHandler(
      (args) => {
        const requestHead = args.get('requestHead')
        assert.equal(requestHead.method, 'GET')
        return 'static path'
      }, {
        inputType: 'empty',
        outputType: 'text'
      })

    const paramHandler = httpHandler(
      (requestHead, streamable) => {
        closeStreamable(streamable)

        assert.equal(requestHead.method, 'POST')
        const { args } = requestHead

        assert.equal(args.get('name'), 'john')
        assert.equal(args.get('path'), '/rest/path',
          'args.path should have extracted subpath')

        assert.equal(requestHead.path, '/person/john/rest/path?foo=bar',
          'requestHead should have original path')

        assert.equal(requestHead.pathname, '/person/john/rest/path',
          'requestHead should have original pathname')

        const responseHead = requestHead.createResponseHead()
          .setStatus(200)

        return [responseHead, textToStreamable('param path')]
      })

    const defaultHandler = httpHandler(
      (requestHead, streamable) => {
        closeStreamable(streamable)

        assert.equal(requestHead.method, 'PUT')
        assert.equal(requestHead.path, '/random/path',
          'random path should reach default handler')

        const responseHead = requestHead.createResponseHead()
          .setStatus(200)

        return [responseHead, textToStreamable('default path')]
      })

    const nestedHandler = simpleHandler(
        (args) => {
          const requestHead = args.get('requestHead')
          assert.equal(requestHead.method, 'POST')

          assert.equal(args.get('path'), '/edit')
          assert.equal(args.get('postId'), '123')

          return 'edit successful'
        }, {
          inputType: 'empty',
          outputType: 'text'
        })

    const apiRouter = streamRouter()
      .addParamRoute('/post/:postId/:restpath', nestedHandler)

    const router = httpRouter()
      .setDefaultHandler(defaultHandler)
      .addStaticRoute('/static', staticHandler)
      .addParamRoute('/person/:name/:restpath', paramHandler)
      .addParamRoute('/api/:restpath', apiRouter)
      .addStaticRoute('/duplicate/static', staticHandler)

    const config = createConfig({
      serverListen: testPort
    })

    const server = await startServer(config, router)

    const sendRequest = async function(method, path) {
      const requestHead = new RequestHead()
        .setHostname('localhost')
        .setPort(testPort)
        .setMethod(method)
        .setPath(path)

      const response = await subrequest(requestHead, emptyStreamable())
      const [ responseHead, streamable ] = response

      assert.equal(responseHead.status, '200')
      return streamableToText(streamable)
    }

    const res1 = await sendRequest('GET', '/static')
    assert.equal(res1, 'static path')

    const res2 = await sendRequest('POST', '/person/john/rest/path?foo=bar')
    assert.equal(res2, 'param path')

    const res3 = await sendRequest('PUT', '/random/path')
    assert.equal(res3, 'default path')

    const res4 = await sendRequest('GET', '/duplicate/static')
    assert.equal(res4, 'static path')

    const res5 = await sendRequest('POST', '/api/post/123/edit')
    assert.equal(res5, 'edit successful')

    server.close()
    assert.end()
  })
})
