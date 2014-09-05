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
var $__quiver_45_object__,
    $__url__,
    $__querystring__,
    $__status_46_js__;
var copy = ($__quiver_45_object__ = require("quiver-object"), $__quiver_45_object__ && $__quiver_45_object__.__esModule && $__quiver_45_object__ || {default: $__quiver_45_object__}).copy;
var urlLib = ($__url__ = require("url"), $__url__ && $__url__.__esModule && $__url__ || {default: $__url__}).default;
var $__5 = urlLib,
    parseUrl = $__5.parse,
    formatUrl = $__5.format;
var qs = ($__querystring__ = require("querystring"), $__querystring__ && $__querystring__.__esModule && $__querystring__ || {default: $__querystring__}).default;
var $__5 = qs,
    parseQueryString = $__5.parse,
    queryStringify = $__5.stringify;
var getStatusMessage = ($__status_46_js__ = require("./status.js"), $__status_46_js__ && $__status_46_js__.__esModule && $__status_46_js__ || {default: $__status_46_js__}).getStatusMessage;
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
  var $__6;
  var rawHead = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__5 = rawHead,
      httpVersion = ($__6 = $__5.httpVersion) === void 0 ? '1.1' : $__6;
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
  var $__5,
      $__7;
  var rawHead = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__6 = rawHead,
      method = ($__5 = $__6.method) === void 0 ? 'GET' : $__5,
      url = ($__7 = $__6.url) === void 0 ? '/' : $__7;
  this._method = assertRegex(method, methodRegex).toUpperCase();
  this._url = assertString(url);
  this._args = {};
  this._reset();
  $traceurRuntime.superCall(this, $RequestHead.prototype, "constructor", [rawHead]);
  this._args.path = this.path, this._args.requestHead = this;
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
    this._protocol = null;
    this._hostname = null;
    this._port = null;
    this._auth = null;
    this.__parsedUrl = null;
    this._queryString = null;
    this.__parsedQuery = null;
  },
  reformatUrl: function() {
    var url = this._url = formatUrl({
      pathname: this.path,
      search: this.queryString,
      protocol: this.protocol,
      hostname: this.hostname,
      port: this.port,
      auth: this.auth
    });
    this._modifiedUrl = false;
    this.__parsedUrl = null;
    return url;
  },
  get url() {
    if (!this._modifiedUrl)
      return this._url;
    return this.reformatUrl();
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
  get urlComponents() {
    if (this._modifiedUrl)
      this.reformatUrl();
    return copy(this._parsedUrl);
  },
  get path() {
    if (this._path)
      return this._path;
    return this.args.path = this._path = this._parsedUrl.pathname;
  },
  set path(newPath) {
    this._path = assertString(newPath);
    this.args.path = newPath;
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
    return this;
  },
  setArgs: function(key, value) {
    this._args[key] = value;
    return this;
  },
  get args() {
    return this._args;
  }
}, {}, HttpHead);
var mixinUrlComponent = (function(prototype, field) {
  var urlField = arguments[2] !== (void 0) ? arguments[2] : field;
  var defaultValue = arguments[3] !== (void 0) ? arguments[3] : null;
  var _field = '_' + field;
  Object.defineProperty(prototype, field, {
    get: function() {
      if (this[_field] !== null)
        return this[_field];
      var value = this[_field] = this._parsedUrl[urlField] || defaultValue;
      return value;
    },
    set: function(value) {
      this[_field] = value;
      this._modifiedUrl = true;
      return this;
    }
  });
});
mixinUrlComponent(RequestHead.prototype, 'protocol');
mixinUrlComponent(RequestHead.prototype, 'hostname');
mixinUrlComponent(RequestHead.prototype, 'port');
mixinUrlComponent(RequestHead.prototype, 'auth');
var ResponseHead = function ResponseHead() {
  var $__7,
      $__6;
  var rawHead = arguments[0] !== (void 0) ? arguments[0] : {};
  var $__5 = rawHead,
      statusCode = ($__7 = $__5.statusCode) === void 0 ? 200 : $__7,
      statusMessage = ($__6 = $__5.statusMessage) === void 0 ? getStatusMessage(statusCode) : $__6;
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
    this._statusCode = assertNumber(code);
  },
  get statusMessage() {
    return this._statusMessage;
  },
  set statusMessage(message) {
    this._statusMessage = assertRegex(message, valueRegex);
  }
}, {}, HttpHead);
