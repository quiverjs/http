import { parse as parseUrl } from 'url'
import { entries } from 'quiver-util/object'

import { RequestHead, ResponseHead } from 'quiver-http-head'

const setScheme = function(options) {
  let requestHead = this
  const { protocol } = options

  if(!protocol) {
    return requestHead.setScheme('http')
  } else {
    // omit colon (:) presence at the end
    return requestHead.setScheme(protocol.replace(':', ''))
  }
}

const setHost = function(options) {
  let requestHead = this
  const { host, hostname, port } = options

  if(host) return requestHead.setAuthority(host)

  if(hostname) {
    requestHead = requestHead.setHostname(hostname)
  }

  if(port) {
    requestHead = requestHead.setPort(port)
  }

  return requestHead
}

const setPath = function(options) {
  let requestHead = this
  const {
    path, pathname, search, query
  } = options

  if(path) return requestHead.setPath(path)

  if(pathname) {
    requestHead = requestHead.setPathname(pathname)
  }

  if(search) {
    requestHead = requestHead.setSearch(search)
  } else if(query) {
    requestHead = requestHead.setQuery(query)
  }

  return requestHead
}

export const setUrlOptions = function(options) {
  return this
    ::setScheme(options)
    ::setHost(options)
    ::setPath(options)
}

export const setUrl = function(url) {
  return this::setUrlOptions(parseUrl(url))
}

const setHeaders = function(rawHeaders) {
  let requestHead = this

  for(let [header, value] of entries(rawHeaders)) {
    if(Array.isArray(value)) {
      value = value.join(' ')
    }
    requestHead = requestHead.setHeader(header.toLowerCase(), value)
  }

  return requestHead
}

export const nodeRequestToRequestHead = request => {
  const {
    url='',
    method='GET',
    headers={}
  } = request

  const urlOptions = parseUrl(url)

  return new RequestHead()
    .setMethod(method)
    ::setUrlOptions(urlOptions)
    ::setHeaders(headers)
}

export const nodeResponseToResponseHead = response => {
  const { statusCode, headers={} } = response

  return new ResponseHead()
    .setStatus(statusCode)
    ::setHeaders(headers)
}

export const requestHeadToRequestOptions = requestHead => {
  const rawHeaders = requestHead.headerObject()

  const {
    scheme='http',
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
