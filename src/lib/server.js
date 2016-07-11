import { createServer } from 'http'

import {
  loadHandler, handleableLoader,
  assertConfig, streamToHttpHandler
} from 'quiver-component/util'

import { httpToNodeHandler } from './node-handler'

export const loadNodeHandler = async (config, component) => {
  assertConfig(config)

  if(!component.isHandlerComponent) {
    throw new Error('First argument must be handler component')
  }

  const handleable = await loadHandler(config, component, {
    loader: handleableLoader
  })

  const streamHandler = handleable.get('streamHandler')
  const httpHandler = handleable.get('httpHandler')

  if(!httpHandler && !streamHandler) throw new Error(
    'Component do not build any valid handler')

  const handler = httpHandler ? httpHandler :
    streamToHttpHandler(streamHandler)

  const nodeHandler = httpToNodeHandler(handler)

  return nodeHandler
}

export const startServer = async (config, component) => {
  const nodeHandler = await loadNodeHandler(config, component)

  const serverListen = config.get('serverListen', 8080)

  return createServer(nodeHandler)
    .listen(serverListen)
}
