import httpLib from 'http'
import httpsLib from 'https'

import urlLib from 'url'

import {
  emptyStreamable,
  nodeReadToStreamable
} from 'quiver-stream-util'

import {
  requestHeadToRequestOptions,
  nodeRequestToRequestHead,
  nodeResponseToResponseHead,
  urlOptionsToRequestHead
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

const subrequest = createProxyHttpRequestHandler()

export const getRequest = async url => {
  const requestHead = urlOptionsToRequestHead(urlLib.parse(url))
    .setMethod('GET')

  return subrequest(requestHead, emptyStreamable())
}
