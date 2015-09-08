import http from 'http'

import {
  RequestHead, ResponseHead
} from './header'

import {
  pipeStream,
  nodeReadToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream
} from 'quiver-stream-util'

import {
  requestHeadToRequestOptions,
  nodeResponseToResponseHead
} from './convert'

import { pipeStreamableToNodeStream } from './pipe'

const doRequest = requestOptions => {
  let request

  const promise = new Promise((resolve, reject) => {
    request = http.request(requestOptions, resolve)
    request.on('error', reject)
  })

  return [request, promise]
}

export const proxyHttpRequestHandlerBuilder = config => {
  const agent = config.get('httpAgent') || new http.Agent()

  return async function(requestHead, requestStreamable) {
    const requestOptions = requestHeadToRequestOptions(requestHead)

    const [request, promise1] = doRequest(requestOptions)

    const promise2 = pipeStreamableToNodeStream(requestStreamable, request)
    const [ response ] = await Promise.all([promise1, promise2])

    const responseHead = nodeResponseToResponseHead(response)
    const responseStreamable = nodeReadToStreamable(response)

    return [responseHead, responseStreamable]
  }
}
