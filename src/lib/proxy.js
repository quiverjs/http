import {
  request as httpRequest,
  Agent as HttpAgent
} from 'http'

import {
  request as httpsRequest,
  Agent as HttpsAgent
} from 'https'

import { parse as parseUrl } from 'url'

import { RequestHead } from 'quiver-http-head'

import {
  emptyStreamable,
  nodeReadToStreamable,
  pipeStreamableToNodeStream
} from 'quiver-stream-util'

import { createConfig } from 'quiver-component/util'

import {
  requestHeadToRequestOptions,
  nodeResponseToResponseHead,
  setUrlOptions
} from './convert'

const performRequest = (requestOptions, requestFunc) => {
  const { protocol } = requestOptions

  let request

  const promise = new Promise((resolve, reject) => {
    request = requestFunc(requestOptions, resolve)
    request.on('error', reject)
  })

  return [request, promise]
}

export const createProxyHttpRequestHandler = (config) => {
  const httpAgent = config.get('httpAgent') || new HttpAgent()
  const httpsAgent = config.get('httpsAgent') || new HttpsAgent()

  return async (requestHead, requestStreamable) => {
    const isHttps = requestHead.scheme === 'https'
    const requestFunc = isHttps ? httpsRequest : httpRequest
    const requestAgent = isHttps ? httpsAgent : httpAgent

    const requestOptions = requestHeadToRequestOptions(requestHead)
    requestOptions.agent = requestAgent

    const [request, promise1] = performRequest(requestOptions, requestFunc)

    const promise2 = pipeStreamableToNodeStream(requestStreamable, request)
    const [ response ] = await Promise.all([promise1, promise2])

    const responseHead = nodeResponseToResponseHead(response)
    const responseStreamable = nodeReadToStreamable(response)

    return [responseHead, responseStreamable]
  }
}

export const subrequest = createProxyHttpRequestHandler(createConfig())

export const getRequest = async url => {
  const requestHead = new RequestHead()
    .setMethod('GET')
    ::setUrlOptions(parseUrl(url))

  return subrequest(requestHead, emptyStreamable())
}
