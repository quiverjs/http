import { async } from 'quiver-promise'
import { normalizeHttpHeader } from './normalize'

import {
  RequestHead, ResponseHead
} from './header'

export const streamToHttpHandler = streamHandler =>
  async function(requestHead, requestStreamable) {
    const args = requestHead.args

    {
      const contentType = requestHead.getHeader('content-type')
      const contentLength = requestHead.getHeader('content-length')

      if(contentType)
        requestStreamable.contentType = contentType

      if(contentLength)
        requestStreamable.contentLength = parseInt(contentLength)
    }

    const resultStreamable = await streamHandler(args, requestStreamable)

    let responseHead = new ResponseHead()

    {
      const { contentType, contentLength } = resultStreamable

      if(contentType) {
        responseHead = responseHead.setHeader('content-type', contentType)
      }

      if(typeof(contentLength) == 'number') {
        responseHead = responseHead.setHeader(
          'content-length', (contentLength|0).toString())
      }
    }

    return [responseHead, resultStreamable]
  }
