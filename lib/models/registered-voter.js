const mongoose = require('mongoose')
const config = require('lib/config')
const regexps = require('lib/regexps')
 var log = require('debug')('democracyos:registered-voter')
const Schema = mongoose.Schema

/**
 * Define 'RegisteredVoter' Schema
 */

const RegisteredVoterSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  county: { type: String },
  yearOfBirth: { type: Number }
})

/**
 * Define Schema Indexes for MongoDB
 */

RegisteredVoterSchema.index({ lastName: 1, firstName: 1})

/**
 * Find 'RegisteredVoter' by first name, last name, county and year of birth
 */
RegisteredVoterSchema.statics.findRegisteredVoter = function (firstInitial, lastName, county, yearOfBirth, cb) {
  var nameRegex = new RegExp("^"+ firstInitial);
  log('firstInitial: [%s], lastName: [%s], county: [%s], yearOfBirth: [%s]', firstInitial, lastName, county, yearOfBirth)
  log(this.findOne({ firstName: nameRegex, lastName, county, yearOfBirth }))
  return this.findOne({ firstName: nameRegex, lastName, county, yearOfBirth }).exec(cb)
}

/**
 * Expose `RegisteredVoter` Model
 */

module.exports = function initialize (conn) {
  return conn.model('RegisteredVoter', RegisteredVoterSchema)
}
