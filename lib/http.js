'use strict'

var header = require('./header')
var path = require('./path')
var stream = require('./stream')

var mergeObjects = require('quiver-merge').mergeObjects

module.exports = mergeObjects([
  header, path, stream
])