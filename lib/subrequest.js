import http from 'http'

import { 
  RequestHead, ResponseHead
} from './header'

import {
  pipeStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream
} from 'quiver-stream-util'

export var requestHeadToOptions = requestHead => {
  var {
    auth,
    hostname,
    port,
    method,
    path,
    queryString,
    headers
  } = requestHead

  return {
    auth,
    hostname,
    port,
    method,
    path: path + '?' + queryString,
    headers
  }
}

export var nodeToQuiverResponse = response => {
  var responseHead = new ResponseHead(response)

  var responseStream = nodeToQuiverReadStream(response)

  return [responseHead, responseStream]
}

export var subrequest = (requestHead, requestStream) =>
  new Promise((resolve, reject) => {
    var request = http.request(
      requestHeadToOptions(requestHead), 
      response =>
        resolve(nodeToQuiverResponse(response)))
    .on('error', reject)

    pipeStream(requestStream, 
      nodeToQuiverWriteStream(request))
  })

export var getRequest = (url, requestStream) =>
  new Promise((resolve, reject) => {
    http.get(url, response =>
        resolve(nodeToQuiverResponse(response)))
    .on('error', reject)
  })
