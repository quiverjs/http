import httpLib from 'http'
import httpsLib from 'https'

import { parse as parseUrl } from 'url'

import { RequestHead } from 'quiver-http-head'

import {
  emptyStreamable,
  nodeReadToStreamable
} from 'quiver-stream-util'

import {
  requestHeadToRequestOptions,
  nodeResponseToResponseHead,
  setUrlOptions
} from './convert'

import { pipeStreamableToNodeStream } from './pipe'

const performRequest = requestOptions => {
  let request

  const promise = new Promise((resolve, reject) => {
    request = httpLib.request(requestOptions, resolve)
    request.on('error', reject)
  })

  return [request, promise]
}

export const createProxyHttpRequestHandler = (agent = new httpLib.Agent()) =>
  async (requestHead, requestStreamable) => {
    const requestOptions = requestHeadToRequestOptions(requestHead)
    requestOptions.agent = agent

    const [request, promise1] = performRequest(requestOptions)

    const promise2 = pipeStreamableToNodeStream(requestStreamable, request)
    const [ response ] = await Promise.all([promise1, promise2])

    const responseHead = nodeResponseToResponseHead(response)
    const responseStreamable = nodeReadToStreamable(response)

    return [responseHead, responseStreamable]
  }

export const subrequest = createProxyHttpRequestHandler()

export const getRequest = async url => {
  const requestHead = new RequestHead()
    .setMethod('GET')
    ::setUrlOptions(parseUrl(url))

  return subrequest(requestHead, emptyStreamable())
}
