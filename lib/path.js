'use strict'

var urlLib = require('url')

var getPathFromRequestHead = function(requestHead) {
  if(requestHead.args && requestHead.args.path) {
    return requestHead.args.path
  }

  return urlLib.parse(requestHead.url, true).pathname
}

module.exports = {
  getPathFromRequestHead: getPathFromRequestHead
}