import { Map as ImmutableMap } from 'immutable'

import {
  HttpHead, $getHeader, $setHeader
} from './head'

import {
  validatePath,
  validateMethod,
  validateScheme,
  validateAuthority
} from '../validate'

const $query = Symbol('@query')
const $basePath = Symbol('@basePath')
const $queryString = Symbol('@queryString')

export class RequestHead extends HttpHead {
  get method() {
    return this[$getHeader](':method')
  }

  get path() {
    return this[$getHeader](':path')
  }

  get scheme() {
    return this[$getHeader](':scheme')
  }

  get authority() {
    return this[$getHeader](':authority')
  }

  setMethod(method) {
    validateMethod(method)
    return this[$setHeader](':method', method)
  }

  setPath(path) {
    validatePath(path)
    return this[$setHeader](':path', path)
  }

  setScheme(scheme) {
    validateScheme(scheme)
    return this[$setHeader](':scheme', scheme)
  }

  setAuthority(authority) {
    validateAuthority(authority)
    return this[$setHeader](':authority', authority)
  }

  get remoteAddress() {
    return this[$getHeader](':remote-address')
  }

  get args() {
    const args = this[$getHeader](':args') || new ImmutableMap()
    return args.set('requestHead', this)
  }

  getArgs(key) {
    return this.args.get(key)
  }

  setArgs(key, value) {
    const args = this.args.set(key, value)
    return this[$setHeader](':args', args)
  }

  get isRequestHead() {
    return true
  }
}
