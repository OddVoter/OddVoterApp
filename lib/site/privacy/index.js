/**
 * Module dependencies.
 */

var express = require('express')

var app = module.exports = express()

app.get('/privacy', require('lib/site/layout'))
