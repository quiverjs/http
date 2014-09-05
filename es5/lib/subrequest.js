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
var $__header_46_js__,
    $__quiver_45_stream_45_util__;
var $__0 = ($__header_46_js__ = require("./header.js"), $__header_46_js__ && $__header_46_js__.__esModule && $__header_46_js__ || {default: $__header_46_js__}),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead;
var $__1 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    pipeStream = $__1.pipeStream,
    streamToStreamable = $__1.streamToStreamable,
    nodeToQuiverReadStream = $__1.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__1.nodeToQuiverWriteStream;
var http = require('http');
var requestHeadToOptions = (function(requestHead) {
  var $__2 = requestHead,
      auth = $__2.auth,
      hostname = $__2.hostname,
      port = $__2.port,
      method = $__2.method,
      path = $__2.path,
      queryString = $__2.queryString,
      headers = $__2.headers;
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
