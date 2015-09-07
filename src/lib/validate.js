
const hasUppercaseRegex = /[A-Z]/
const validHeaderValueRegex = /^[\x20-\x7E]$/

// Allowed header name characters except uppercase
// http://httpwg.github.io/specs/rfc7230.html#rule.token.separators
const validHeaderNameRegex = /^[a-z0-9\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~]+$/

const validStatusRegex = /^\d{3}$/
const validSchemeRegex = /^[a-z][a-z0-9\+\-\.]*$/
const validTokenRegex = /^[a-zA-Z0-9\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~]+$/

const regNameRegex = `[a-zA-Z\\-\\.\\_\\~` +
  `\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]` +
  `|\\%[0-9a-fA-F][0-9a-fA-F]`

const pcharRegex = regNameRegex + `|[\\:\\@]`

const validPathRegex = new RegExp(`^/(${pcharRegex})*\\??(${pcharRegex})*$`)
const validAuthorityRegex = new RegExp(`^${regNameRegex}+(\\:\\d+)?$/`)

export const validateHeaderName = name => {
  if(hasUppercaseRegex.test(name))
    throw new Error('header name must be converted to lowercase')

  if(!validHeaderNameRegex.test(name))
    throw new Error('header name contains invalid character')
}

export const validateHeaderValue = value => {
  if(!validHeaderValueRegex.test(value))
    throw new Error('header value contains invalid character')
}

export const validateMethod = method => {
  if(!validTokenRegex.test(method))
    throw new Error('method contains invalid character')
}

export const validatePath = path => {
  if(path === '/' || path === '*') return
  if(!validPathRegex.test(path))
    throw new Error('request path contains invalid character')
}

export const validateScheme = scheme => {
  if(!validSchemeRegex.test(scheme))
    throw new Error('scheme contains invalid character')
}

export const validateAuthority = authority => {
  if(!validAuthorityRegex.test(authority))
    throw new Error('request authority contains invalid character')
}

export const validateStatus = status => {
  if(!validStatusRegex.test(status))
    throw new Error('response status contains invalid character')
}
