import { 
  RequestHead, ResponseHead
} from './head.js'

export var streamToHttpHandler = streamHandler =>
  (requestHead, requestStreamable) => {
    var args = requestHead.args

    return streamHandler(args, requestStreamable)
    .then(resultStreamable => {
      var responseHead = new ResponseHead()

      var { 
        contentType, contentLength 
      } = resultStreamable

      if(contentType) {
        responseHead.setHeader('content-type', contentType)
      }

      if(contentLength) {
        responseHead.setHeader('content-length', contentLength)
      }

      return [responseHead, resultStreamable]
    })
  }