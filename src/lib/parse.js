import  {
  parse as parseUrl,
  format as formatUrl
} from 'url'

import {
  parse as parseQueryString,
  stringify as queryStringify
} from 'querystring'

export const parseRequestHead = requestHead => {
  const result = { }

  const fullPath = requestHead.path
  if(!fullPath)
    throw new Error('request path is not defined')

  const split = fullPath.split('?')
  result.pathname = split[0]

  if(split[1])
    result.query = parseQueryString(split[1])

  const authority = requestHead.authority || requestHead.getHeader('host')
  if(authority) {
    const { hostname, port } = parseUrl(authority)
    result.hostname = hostname
    result.port = port
  }

  return result
}
