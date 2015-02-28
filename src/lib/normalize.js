let commonHeaders = [
  'Accept',
  'Accept-Charset',
  'Accept-Encoding',
  'Accept-Language',
  'Accept-Datetime',
  'Authorization',
  'Cache-Control',
  'Connection',
  'Cookie',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'Expect',
  'From',
  'Host',
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Max-Forwards',
  'Origin',
  'Pragma',
  'Proxy-Authorization',
  'Range',
  'Referer',
  'Referrer',
  'TE',
  'User-Agent',
  'Upgrade',
  'Via',
  'Warning',
  'Access-Control-Allow-Origin',
  'Accept-Ranges',
  'Age',
  'Allow',
  'Cache-Control',
  'Connection',
  'Content-Encoding',
  'Content-Language',
  'Content-Location',
  'Content-Disposition',
  'Content-Range',
  'Date',
  'ETag',
  'Expires',
  'Last-Modified',
  'Link',
  'Location',
  'P3P',
  'Pragma',
  'Proxy-Authenticate',
  'Refresh',
  'Retry-After',
  'Server',
  'Set-Cookie',
  'Status',
  'Strict-Transport-Security',
  'Trailer',
  'Transfer-Encoding',
  'lety',
  'Warning',
  'WWW-Authenticate',
  'X-Frame-Options',
  'X-Requested-With',
  'DNT',
  'X-Forwarded-For',
  'X-Forwarded-Proto',
  'Front-End-Https',
  'X-ATT-DeviceId',
  'X-Wap-Profile',
  'Proxy-Connection',
  'Public-Key-Pins',
  'X-XSS-Protection',
  'Content-Security-Policy',
  'X-Content-Security-Policy',
  'X-WebKit-CSP',
  'X-Content-Type-Options',
  'X-Powered-By',
  'X-UA-Compatible'
]

export let normalizeTable = commonHeaders.reduce(
  (table, header) => {
    table[header.toLowerCase()] = header
    return table
  }, {})

let capitalize = str =>
  (str[0].toUpperCase() + str.slice(1))

export let normalizeHttpHeader = (header, cache=false) => {
  if(normalizeTable[header]) return normalizeTable[header]

  let normalized = header.split('-')
    .map(capitalize)
    .join('-')

  if(cache)
    normalizeTable[header] = normalized

  return normalized
}