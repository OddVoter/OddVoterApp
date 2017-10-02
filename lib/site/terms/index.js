/**
 * Module dependencies.
 */

var express = require('express')

var app = module.exports = express()

app.get('/terms', require('lib/site/layout'))
