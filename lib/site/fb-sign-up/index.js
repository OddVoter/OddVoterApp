/**
 * Module dependencies.
 */

var express = require('express')
var app = module.exports = express()
var config = require('lib/config')

function redirect (req, res) {
  var path = req.params.path || ''
  var url = config.signupUrl + (path ? '/' + path : '')
  res.redirect(url)
}

if (config.signupUrl) {
  app.get('/fb-signup', redirect)
  app.get('/fb-signup/:path', redirect)
}

app.get('/fb-signup', require('lib/site/layout'))
