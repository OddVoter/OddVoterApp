/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:voter-match')
var express = require('express')
var config = require('lib/config')
var api = require('lib/db-api')
var voterMatch = require('lib/voter-match');

/**
 * Exports Application
 */

var app = module.exports = express()

app.post('/voter-match', function (req, res) {

  var firstName = req.body.firstName
  var lastName = req.body.lastName
  var county = req.body.county
  var dateOfBirth = req.body.dateOfBirth

  voterMatch.findRegisteredVoter(firstName, lastName, county, dateOfBirth)
    .then(function(match) {
      if (match !== null) {
        return res.status(200).send()
      }
      return res.status(400).send()
    })
    .catch(function(err) {
      return res.status(500).json({message: err.message })
    })
})
