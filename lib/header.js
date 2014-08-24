import { copy } from 'quiver-object'
import { 
  parse as parseUrl,
  format as formatUrl
} from 'url'

import { 
  parse as parseQueryString,
  stringify as queryStringify
} from 'querystring'

var assertString = (str) => {
  if(typeof(str) != 'string')
    throw new Error('argument must be string')

  return str
}

var assertNumber = (num) => {
  if(typeof(num) != 'number')
    throw new Error('argument must be number')

  return num
}

var assertRegex = (str, regex) => {
  if(regex.test(assertString(str)))
    throw new Error('string contains invalid characters')

  return str
}

var fieldRegex = /[^a-zA-Z\-]/
var valueRegex = /[^\x20-\x7E]/
var methodRegex = /[^a-zA-Z]/

class HttpHead {
  constructor(rawHead={}) {
    var {
      httpVersion='1.1'
    } = rawHead

    this._httpVersion = httpVersion

    if(rawHead.headers) {
      var rawHeaders = rawHead.headers

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
    var key = assertRegex(header, fieldRegex).toLowerCase()

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
    return copy(this._headers)
  }
}

export class RequestHead extends HttpHead {
  constructor(rawHead={}) {
    var {
      method='GET',
      url='/'
    } = rawHead

    this._method = assertRegex(method, methodRegex)
    this._url = assertString(url)

    this._args = { }
    this._reset()

    super(rawHead)
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
    this.__parsedUrl = null
    this._queryString = null
    this.__parsedQuery = null
  }

  get url() {
    if(!this._modifiedUrl) return this._url

    var url = this._url = formatUrl({
      pathname: this.path,
      search: this.queryString
    })

    this._modifiedUrl = false
    this.__parsedUrl = null

    return url
  }

  set url(newUrl) {
    this._url = newUrl
    this._reset()
  }

  get _parsedUrl() {
    if(this.__parsedUrl) return this.__parsedUrl

    var parsed = this.__parsedUrl = parseUrl(this._url)
    return parsed
  }

  get path() {
    if(this._path) return this._path

    var path = this._path = this._parsedUrl.pathname
    return path
  }

  set path(newPath) {
    this._path = assertString(newPath)
    this._modifiedUrl = true
  }

  get queryString() {
    if(this._modifiedQuery) {
      var queryString = this._queryString =
        queryStringify(this.__parsedQuery)

      this._modifiedQuery = false
      return queryString
    }

    if(this._queryString) {
      return this._queryString
    }

    var queryString = this._queryString =
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

    var query = this.__parsedQuery = 
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
    var args = copy(this._args)

    args.path = this.path
    args.requestHead = this

    return args
  }
}

export class ResponseHead extends HttpHead {
  constructor(rawHead={}) {
    var {
      statusCode=200,
      statusMessage='OK'
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
  }

  get statusMessage() {
    return this._statusMessage
  }

  set statusMessage(message) {
    this._statusMessage = assertRegex(message, valueRegex)
  }
}