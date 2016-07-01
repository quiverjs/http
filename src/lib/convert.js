import { parse as parseUrl } from 'url'
import { entries } from 'quiver-util/object'
import { ImmutableMap } from 'quiver-util/immutable'

import { RequestHead, ResponseHead } from 'quiver-http-head'

const responseHeaders = function*(response) {
  yield [':status', response.statusCode.toString()]

  const { headers={} } = response
  for(let key of Object.keys(headers)) {
    yield [key.toLowerCase(), headers[key]]
  }
}

export const urlOptionsToRequestHead = (urlOptions, requestHead = new RequestHead()) => {
  const {
    protocol='http:',

    host,
    path,

    hostname='localhost',
    port=80,
    pathname='/',
    search='',
    query=''

  } = urlOptions

  if(protocol) {
    requestHead = requestHead.setScheme(protocol.slice(0, -1))
  }

  if(host) {
    requestHead = requestHead.setAuthority(host)
  } else {
    if(hostname) {
      requestHead = requestHead.setHostname(hostname)
    }

    if(port) {
      requestHead = requestHead.setPort(port)
    }
  }

  if(path) {
    requestHead = requestHead.setPath(path)
  } else {
    if(pathname) {
      requestHead = requestHead.setPathname(pathname)
    }

    if(search) {
      requestHead = requestHead.setSearch(search)
    }

    if(query) {
      requestHead = requestHead.setQuery(query)
    }
  }

  return requestHead
}

export const nodeRequestToRequestHead = request => {
  const {
    url='',
    method='GET',
    headers={}
  } = request

  let requestHead = urlOptionsToRequestHead(parseUrl(url))
    .setMethod(method)

  for(const [header, value] of entries(headers)) {
    requestHead = requestHead.setHeader(header.toLowerCase(), value)
  }

  return requestHead
}

export const nodeResponseToResponseHead = response =>
  new ResponseHead({
    rawHeaders: ImmutableMap(responseHeaders(response))
  })

export const requestHeadToRequestOptions = requestHead => {
  const rawHeaders = requestHead.headerObject()

  const {
    scheme,
    hostname,
    port,
    method,
    path,
  } = requestHead

  return {
    protocol: scheme + ':',
    hostname,
    port,
    method,
    path,
    headers: rawHeaders
  }
}
