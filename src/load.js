const d3 = require('d3-request')

var GITHUB_BASE = 'https://api.github.com/'

function loadGeoJSON (id, opts, cb) {
  var parts = (id || '').split(':')
  switch (parts[0]) {
    case 'github':
      return loadGithub(parts[1], opts, cb)
    default:
      return d3.json('/sample.geojson', cb)
  }
}

function loadGithub (id, opts, cb) {
  const url = fileUrl(id)
  const request = d3.json(url)
    .mimeType('application/vnd.github.v3.raw')
  if (opts.token) {
    request.header('Authorization', 'token ' + opts.token)
  }
  return request.get(cb)
}

function fileUrl (id) {
  var parts = id.split('/')
  return GITHUB_BASE + 'repos/' +
        parts[0] +
        '/' + parts[1] +
        '/contents/' + parts.slice(3).join('/') +
        '?ref=' + parts[2]
}

module.exports = loadGeoJSON
