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

export let requestHeadToOptions = requestHead => {
  let {
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

export let nodeToQuiverResponse = response => {
  let responseHead = new ResponseHead(response)

  let responseStream = nodeToQuiverReadStream(response)

  return [responseHead, responseStream]
}

export let subrequest = (requestHead, requestStream) =>
  new Promise((resolve, reject) => {
    let request = http.request(
      requestHeadToOptions(requestHead), 
      response =>
        resolve(nodeToQuiverResponse(response)))
    .on('error', reject)

    pipeStream(requestStream, 
      nodeToQuiverWriteStream(request))
  })

export let getRequest = (url, requestStream) =>
  new Promise((resolve, reject) => {
    http.get(url, response =>
        resolve(nodeToQuiverResponse(response)))
    .on('error', reject)
  })
