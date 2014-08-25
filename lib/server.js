import { createServer } from 'http'
import { async } from 'quiver-promise'

import { 
  httpToNodeHandler, streamToHttpHandler 
} from './handler.js'

export var startServer = async(
function*(component, config, listenOptions) {
  var builder = component.handleableBuilder

  if(!builder) throw new Error(
    'Component do not have handleableBuilder')

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
    .listen(listenOptions)
})