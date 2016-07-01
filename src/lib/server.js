import { createServer } from 'http'

import {
  loadHandler, handleableLoader
} from 'quiver-component/util'

import { httpToNodeHandler } from './node-handler'
import { streamToHttpHandler } from './stream-handler'

export const startServer = async (config, component) => {
  if(!component.isHandlerComponent) {
    throw new Error('First argument must be handler component')
  }

  const serverListen = config.get('serverListen', 8080)

  const handleable = await loadHandler(config, component, {
    handlerLoader: handleableLoader
  })

  const streamHandler = handleable.get('streamHandler')
  const httpHandler = handleable.get('httpHandler')

  if(!httpHandler && !streamHandler) throw new Error(
    'Component do not build any valid handler')

  const handler = httpHandler ? httpHandler :
    streamToHttpHandler(streamHandler)

  const nodeHandler = httpToNodeHandler(handler)

  return createServer(nodeHandler)
    .listen(serverListen)
}
