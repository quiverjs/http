import { Map as ImmutableMap } from 'immutable'

import { RequestHead } from './class/request'

const requestHeaders = function*(request) {
  yield [':method', request.method]
  yield [':path', request.url]
  yield [':remote-address', request.connection.remoteAddress]

  for(let key of Object.keys(request.headers)) {
    yield [key.toLowerCase(), headers[key]]
  }
}

const responseHeaders = function*(response) {
  yield [':status', response.statusCode.toString()]

  for(let key of Object.keys(response.headers)) {
    yield [key.toLowerCase(), headers[key]]
  }
}

export const nodeRequestToRequestHead = request =>
  new RequestHead(new ImmutableMap(
    requestHeaders(request)))

export const nodeResponseToResponseHead = response =>
  new ResponseHead(new ImmutableMap(
    responseHeaders(response)))

export const requestHeadToRequestOptions = requestHead => {
  const {
    scheme: protocol,
    hostname,
    port,
    method,
    path,
    headerObject: headers
  } = requestHead

  return {
    protocol,
    hostname,
    port,
    method,
    path,
    headers
  }
}
