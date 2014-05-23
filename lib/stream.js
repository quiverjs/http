'use strict'

var pathLib = require('./path')
var headerLib = require('./header')

var trivialStreamToHttpHandler = function(streamHandler) {
  var httpHandler = function(requestHead, requestStreamable, callback) {
    var path = pathLib.getPathFromRequestHead(requestHead)

    var args = { }

    if(requestHead.args) {
      args = requestHead.args
      delete requestHead.args
    }

    args.path = path
    args.requestHead = requestHead

    streamHandler(args, requestStreamable, function(err, resultStreamable) {
      if(err) return callback(err)
      
      var responseHead = headerLib.streamableToResponseHead(resultStreamable)

      callback(null, responseHead, resultStreamable)
    })
  }

  return httpHandler
}

module.exports = {
  trivialStreamToHttpHandler: trivialStreamToHttpHandler
}