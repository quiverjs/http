import http from 'http'
import { async } from 'quiver-promise'

let { createServer } = http

import { 
  httpToNodeHandler, streamToHttpHandler 
} from './handler.js'

export let startServer = async(
function*(component, config) {
  if(!component.isHandlerComponent) {
    throw new Error('First argument must be handler component')
  }

  let builder = component.toHandleableBuilder()
  let { serverListen=8080 } = config

  if(!config) throw new Error(
    'Config is not defined')

  let {
    streamHandler,
    httpHandler
  } = yield builder(config)

  if(!httpHandler && !streamHandler) throw new Error(
    'Component do not build any valid handler')

  let handler = httpHandler ? httpHandler :
    streamToHttpHandler(streamHandler)

  return createServer(httpToNodeHandler(handler))
    .listen(serverListen)
})