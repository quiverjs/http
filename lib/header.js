import http from 'http'
import urlLib from 'url'
import { copy } from 'quiver-object'

let { 
  parse: parseUrl,
  format: formatUrl
} = urlLib

import qs from 'querystring'

let { 
  parse: parseQueryString,
  stringify: queryStringify
} = qs

let statusCodeTable = http.STATUS_CODES

let getStatusMessage = statusCode =>
  (statusCodeTable[statusCode] || 'Unknown')

let assertString = (str) => {
  if(typeof(str) != 'string')
    throw new Error('argument must be string')

  return str
}

let assertNumber = (num) => {
  if(typeof(num) != 'number')
    throw new Error('argument must be number')

  return num
}

let assertRegex = (str, regex) => {
  if(regex.test(assertString(str)))
    throw new Error('string contains invalid characters')

  return str
}

let fieldRegex = /[^a-zA-Z\-]/
let valueRegex = /[^\x20-\x7E]/
let methodRegex = /[^a-zA-Z]/

class HttpHead {
  constructor(rawHead={}) {
    let {
      httpVersion='1.1'
    } = rawHead

    this._httpVersion = httpVersion

    if(rawHead.headers) {
      let rawHeaders = rawHead.headers

      this._headers = Object.keys(rawHeaders)
        .reduce((headers, key) => {
          headers[key.toLowerCase()] = 
            assertString(rawHeaders[key])

          return headers
        }, {})

    } else {
      this._headers = { }
    }
  }

  get httpVersion() {
    return this._httpVersion
  }

  setHeader(header, value) {
    let key = assertRegex(header, fieldRegex).toLowerCase()

    this._headers[key] = assertRegex(value, valueRegex)

    return this
  }

  getHeader(header) {
    return this._headers[header.toLowerCase()]
  }

  removeHeader(header) {
    delete this._headers[header.toLowerCase()]
  }

  get headers() {
    return this._headers
  }
}

export class RequestHead extends HttpHead {
  constructor(rawHead={}) {
    let {
      method='GET',
      url='/'
    } = rawHead

    this._method = assertRegex(method, methodRegex)

    this._url = assertString(url)
    this._args = { }

    this._reset()

    super(rawHead)
    
    this._args.path = this.path,
    this._args.requestHead = this
  }

  get method() {
    return this._method
  }

  set method(newMethod) {
    this._method = assertRegex(newMethod, methodRegex)
      .toUpperCase()
  }

  _reset() {
    this._modifiedUrl = false
    this._modifiedQuery = false

    this._path = null
    this._protocol = null
    this._hostname = null
    this._port = null
    this._auth = null

    this.__parsedUrl = null
    this._queryString = null
    this.__parsedQuery = null
  }

  reformatUrl() {
    let url = this._url = formatUrl({
      pathname: this.path,
      search: this.queryString,
      protocol: this.protocol,
      hostname: this.hostname,
      port: this.port,
      auth: this.auth
    })

    this._modifiedUrl = false
    this.__parsedUrl = null

    return url
  }

  get url() {
    if(!this._modifiedUrl) return this._url

    return this.reformatUrl()
  }

  set url(newUrl) {
    this._url = newUrl
    this._reset()
  }

  get _parsedUrl() {
    if(this.__parsedUrl) return this.__parsedUrl

    let parsed = this.__parsedUrl = parseUrl(this._url)
    return parsed
  }

  get urlComponents() {
    if(this._modifiedUrl) this.reformatUrl()

    return copy(this._parsedUrl)
  }

  get path() {
    if(this._path) return this._path

    return this.args.path = this._path = 
      this._parsedUrl.pathname
  }

  set path(newPath) {
    this._path = assertString(newPath)
    this.args.path = newPath
    this._modifiedUrl = true
  }

  get queryString() {
    if(this._modifiedQuery) {
      let queryString = this._queryString =
        queryStringify(this.__parsedQuery)

      this._modifiedQuery = false
      return queryString
    }

    if(this._queryString) {
      return this._queryString
    }

    let queryString = this._queryString =
      this._parsedUrl.query || ''

    return queryString
  }

  set queryString(str) {
    this._queryString = assertString(str)

    this.__parsedQuery = null
    this._modifiedUrl = true
    this._modifiedQuery = false
  }

  get _parsedQuery() {
    if(this.__parsedQuery) 
      return this.__parsedQuery

    let query = this.__parsedQuery = 
      parseQueryString(this.queryString)

    return query
  }

  get query() {
    return copy(this._parsedQuery)
  }

  setQuery(key, value) {
    this._parsedQuery[assertString(key)] = 
      assertString(value)

    this._modifiedQuery = true
    this._modifiedUrl = true

    return this
  }

  setArgs(key, value) {
    this._args[key] = value

    return this
  }

  get args() {
    return this._args
  }
}

let mixinUrlComponent = (prototype, field, 
  urlField=field, defaultValue=null) => 
{
  let _field = '_' + field

  Object.defineProperty(prototype, field, {
    get() {
      if(this[_field] !== null) return this[_field]

      let value = this[_field] = 
        this._parsedUrl[urlField] || defaultValue

      return value
    },

    set(value) {
      this[_field] = value
      this._modifiedUrl = true

      return this
    }
  })
}

mixinUrlComponent(RequestHead.prototype, 'protocol')
mixinUrlComponent(RequestHead.prototype, 'hostname')
mixinUrlComponent(RequestHead.prototype, 'port')
mixinUrlComponent(RequestHead.prototype, 'auth')

export class ResponseHead extends HttpHead {
  constructor(rawHead={}) {
    let {
      statusCode=200,
      statusMessage=getStatusMessage(statusCode)
    } = rawHead

    this._statusCode = assertNumber(statusCode)
    this._statusMessage = assertRegex(statusMessage, valueRegex)

    super(rawHead)
  }

  get statusCode() {
    return this._statusCode
  }

  set statusCode(code) {
    this._statusCode = assertNumber(code)
    this._statusMessage = getStatusMessage(code)
  }

  get statusMessage() {
    return this._statusMessage
  }

  set statusMessage(message) {
    this._statusMessage = assertRegex(message, valueRegex)
  }
}