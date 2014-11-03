"use strict";
Object.defineProperties(exports, {
  requestHeadToOptions: {get: function() {
      return requestHeadToOptions;
    }},
  nodeToQuiverResponse: {get: function() {
      return nodeToQuiverResponse;
    }},
  subrequest: {get: function() {
      return subrequest;
    }},
  getRequest: {get: function() {
      return getRequest;
    }},
  __esModule: {value: true}
});
var $__http__,
    $__header__,
    $__quiver_45_stream_45_util__;
var http = ($__http__ = require("http"), $__http__ && $__http__.__esModule && $__http__ || {default: $__http__}).default;
var $__1 = ($__header__ = require("./header"), $__header__ && $__header__.__esModule && $__header__ || {default: $__header__}),
    RequestHead = $__1.RequestHead,
    ResponseHead = $__1.ResponseHead;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    pipeStream = $__2.pipeStream,
    streamToStreamable = $__2.streamToStreamable,
    nodeToQuiverReadStream = $__2.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__2.nodeToQuiverWriteStream;
var requestHeadToOptions = (function(requestHead) {
  var $__3 = requestHead,
      auth = $__3.auth,
      hostname = $__3.hostname,
      port = $__3.port,
      method = $__3.method,
      path = $__3.path,
      queryString = $__3.queryString,
      headers = $__3.headers;
  return {
    auth: auth,
    hostname: hostname,
    port: port,
    method: method,
    path: path + '?' + queryString,
    headers: headers
  };
});
var nodeToQuiverResponse = (function(response) {
  var responseHead = new ResponseHead(response);
  var responseStream = nodeToQuiverReadStream(response);
  return [responseHead, responseStream];
});
var subrequest = (function(requestHead, requestStream) {
  return new Promise((function(resolve, reject) {
    var request = http.request(requestHeadToOptions(requestHead), (function(response) {
      return resolve(nodeToQuiverResponse(response));
    })).on('error', reject);
    pipeStream(requestStream, nodeToQuiverWriteStream(request));
  }));
});
var getRequest = (function(url, requestStream) {
  return new Promise((function(resolve, reject) {
    http.get(url, (function(response) {
      return resolve(nodeToQuiverResponse(response));
    })).on('error', reject);
  }));
});
