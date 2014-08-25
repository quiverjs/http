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
var $__0 = $traceurRuntime.assertObject(require('./header.js')),
    RequestHead = $__0.RequestHead,
    ResponseHead = $__0.ResponseHead;
var $__0 = $traceurRuntime.assertObject(require('quiver-stream-util')),
    pipeStream = $__0.pipeStream,
    streamToStreamable = $__0.streamToStreamable,
    nodeToQuiverReadStream = $__0.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__0.nodeToQuiverWriteStream;
var http = require('http');
var requestHeadToOptions = (function(requestHead) {
  var $__0 = $traceurRuntime.assertObject(requestHead),
      auth = $__0.auth,
      hostname = $__0.hostname,
      port = $__0.port,
      method = $__0.method,
      path = $__0.path,
      queryString = $__0.queryString,
      headers = $__0.headers;
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
