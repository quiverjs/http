import { 
  RequestHead, ResponseHead
} from './header.js'

export var streamToHttpHandler = streamHandler =>
  (requestHead, requestStreamable) => {
    var args = requestHead.args

    var contentType = requestHead.getHeader('content-type')
    var contentLength = requestHead.getHeader('content-length')

    if(contentType)
      requestStreamable.contentType = contentType

    if(contentLength)
      requestStreamable.contentLength = contentLength

    return streamHandler(args, requestStreamable)
    .then(resultStreamable => {
      var responseHead = new ResponseHead()

      var { 
        contentType, contentLength 
      } = resultStreamable

      if(contentType) {
        responseHead.setHeader('content-type', contentType)
      }

      if(typeof(contentLength) == 'number') {
        responseHead.setHeader('content-length', 
          (contentLength|0).toString())
      }

      return [responseHead, resultStreamable]
    })
  }