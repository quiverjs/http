"use strict";
Object.defineProperties(exports, {
  RequestHead: {get: function() {
      return RequestHead;
    }},
  ResponseHead: {get: function() {
      return ResponseHead;
    }},
  __esModule: {value: true}
});
var copy = $traceurRuntime.assertObject(require('quiver-object')).copy;
var $__1 = $traceurRuntime.assertObject(require('url')),
    parseUrl = $__1.parse,
    formatUrl = $__1.format;
var $__1 = $traceurRuntime.assertObject(require('querystring')),
    parseQueryString = $__1.parse,
    queryStringify = $__1.stringify;
var assertString = (function(str) {
  if (typeof(str) != 'string')
    throw new Error('argument must be string');
  return str;
});
var assertNumber = (function(num) {
  if (typeof(num) != 'number')
    throw new Error('argument must be number');
  return num;
});
var assertRegex = (function(str, regex) {
  if (regex.test(assertString(str)))
    throw new Error('string contains invalid characters');
  return str;
});
var fieldRegex = /[^a-zA-Z\-]/;
var valueRegex = /[^\x20-\x7E]/;
var methodRegex = /[^a-zA-Z]/;
var HttpHead = function HttpHead() {
  var $__2;
  var rawHead = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__1 = $traceurRuntime.assertObject(rawHead),
      httpVersion = ($__2 = $__1.httpVersion) === void 0 ? '1.1' : $__2;
  this._httpVersion = httpVersion;
  if (rawHead.headers) {
    var rawHeaders = rawHead.headers;
    this._headers = Object.keys(rawHeaders).reduce((function(headers, key) {
      headers[key.toLowerCase()] = assertString(rawHeaders[key]);
      return headers;
    }), {});
  } else {
    this._headers = {};
  }
};
($traceurRuntime.createClass)(HttpHead, {
  get httpVersion() {
    return this._httpVersion;
  },
  setHeader: function(header, value) {
    var key = assertRegex(header, fieldRegex).toLowerCase();
    this._headers[key] = assertRegex(value, valueRegex);
    return this;
  },
  getHeader: function(header) {
    return this._headers[header.toLowerCase()];
  },
  removeHeader: function(header) {
    delete this._headers[header.toLowerCase()];
  },
  get headers() {
    return copy(this._headers);
  }
}, {});
var RequestHead = function RequestHead() {
  var $__2;
  var rawHead = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__1 = $traceurRuntime.assertObject(rawHead),
      method = ($__2 = $__1.method) === void 0 ? 'GET' : $__2,
      url = ($__2 = $__1.url) === void 0 ? '/' : $__2;
  this._method = assertRegex(method, methodRegex);
  this._url = assertString(url);
  this._args = {};
  this._reset();
  $traceurRuntime.superCall(this, $RequestHead.prototype, "constructor", [rawHead]);
};
var $RequestHead = RequestHead;
($traceurRuntime.createClass)(RequestHead, {
  get method() {
    return this._method;
  },
  set method(newMethod) {
    this._method = assertRegex(newMethod, methodRegex).toUpperCase();
  },
  _reset: function() {
    this._modifiedUrl = false;
    this._modifiedQuery = false;
    this._path = null;
    this.__parsedUrl = null;
    this._queryString = null;
    this.__parsedQuery = null;
  },
  get url() {
    if (!this._modifiedUrl)
      return this._url;
    var url = this._url = formatUrl({
      pathname: this.path,
      search: this.queryString
    });
    this._modifiedUrl = false;
    this.__parsedUrl = null;
    return url;
  },
  set url(newUrl) {
    this._url = newUrl;
    this._reset();
  },
  get _parsedUrl() {
    if (this.__parsedUrl)
      return this.__parsedUrl;
    var parsed = this.__parsedUrl = parseUrl(this._url);
    return parsed;
  },
  get path() {
    if (this._path)
      return this._path;
    var path = this._path = this._parsedUrl.pathname;
    return path;
  },
  set path(newPath) {
    this._path = assertString(newPath);
    this._modifiedUrl = true;
  },
  get queryString() {
    if (this._modifiedQuery) {
      var queryString = this._queryString = queryStringify(this.__parsedQuery);
      this._modifiedQuery = false;
      return queryString;
    }
    if (this._queryString) {
      return this._queryString;
    }
    var queryString = this._queryString = this._parsedUrl.query || '';
    return queryString;
  },
  set queryString(str) {
    this._queryString = assertString(str);
    this.__parsedQuery = null;
    this._modifiedUrl = true;
    this._modifiedQuery = false;
  },
  get _parsedQuery() {
    if (this.__parsedQuery)
      return this.__parsedQuery;
    var query = this.__parsedQuery = parseQueryString(this.queryString);
    return query;
  },
  get query() {
    return copy(this._parsedQuery);
  },
  setQuery: function(key, value) {
    this._parsedQuery[assertString(key)] = assertString(value);
    this._modifiedQuery = true;
    this._modifiedUrl = true;
  },
  setArgs: function(key, value) {
    this._args[key] = value;
  },
  get args() {
    var args = copy(this._args);
    args.path = this.path;
    args.requestHead = this;
    return args;
  }
}, {}, HttpHead);
var ResponseHead = function ResponseHead() {
  var $__2;
  var rawHead = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__1 = $traceurRuntime.assertObject(rawHead),
      statusCode = ($__2 = $__1.statusCode) === void 0 ? 200 : $__2,
      statusMessage = ($__2 = $__1.statusMessage) === void 0 ? '' : $__2;
  this._statusCode = assertNumber(statusCode);
  this._statusMessage = assertRegex(statusMessage, valueRegex);
  $traceurRuntime.superCall(this, $ResponseHead.prototype, "constructor", [rawHead]);
};
var $ResponseHead = ResponseHead;
($traceurRuntime.createClass)(ResponseHead, {
  get statusCode() {
    return this._statusCode;
  },
  set statusCode(code) {
    this._statusCode = assertNumber(statusCode);
  },
  get statusMessage() {
    return this._statusMessage;
  },
  set statusMessage(message) {
    this._statusMessage = assertRegex(message, valueRegex);
  }
}, {}, HttpHead);
