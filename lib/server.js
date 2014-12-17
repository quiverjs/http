import http from 'http'
import { async } from 'quiver-promise'

var { createServer } = http

import { 
  httpToNodeHandler, streamToHttpHandler 
} from './handler.js'

export var startServer = async(
function*(component, config) {
  if(!component.isHandlerComponent) {
    throw new Error('First argument must be handler component')
  }

  var builder = component.toHandleableBuilder()
  var { serverListen=8080 } = config

  if(!config) throw new Error(
    'Config is not defined')

  var {
    streamHandler,
    httpHandler
  } = yield builder(config)

  if(!httpHandler && !streamHandler) throw new Error(
    'Component do not build any valid handler')

  var handler = httpHandler ? httpHandler :
    streamToHttpHandler(streamHandler)

  return createServer(httpToNodeHandler(handler))
    .listen(serverListen)
})