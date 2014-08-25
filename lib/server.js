import { createServer } from 'http'
import { async } from 'quiver-promise'

import { httpToNodeHandler } from './handler.js'

export var startServer = async(
function*(component, config, listenOptions) {
  var builder = component.handleableBuilder

  if(!builder) throw new Error(
    'Component do not have handleableBuilder')

  if(!config) throw new Error(
    'Config is not defined')

  var handleable = yield builder(config)
  var handler = handleable.httpHandler

  if(!handler) throw new Error(
    'Component do not build HTTP handler')

  return createServer(httpToNodeHandler(handler))
    .listen(listenOptions)
})