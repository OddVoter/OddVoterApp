const mongoose = require('mongoose')
const config = require('lib/config')
const regexps = require('lib/regexps')
var log = require('debug')('democracyos:registered-voter')
const Schema = mongoose.Schema

/**
 * Define 'RegisteredVoter' Schema
 */

const RegisteredVoterSchema = new Schema({
  voterRegistration: { type: String},
  registrationDate: { type: String},
  firstName: { type: String },
  lastName: { type: String },
  streetNumber: { type: String},
  aptNumber: { type: String},
  streetName: { type: String},
  city: {type: String},
  zipCode:  {type: String},
  county: { type: String },
  mailingAddress:  {type: String},
  race:  {type: String},
  gender:  {type: String},
  status:  {type: String},
  yearOfBirth: { type: Number },
  specialDesignation:  {type: String},
  countyPrecinct:  {type: String},
  countyPrecinctDescription:  {type: String},
  municipalPrecinct:  {type: String},
  municipalPrecinctDescription:  {type: String},
  comboNumber:  {type: String},
  lastVotedDate:  {type: String},
  lastVotedParty:  {type: String},
  cng:  {type: String},
  sen:  {type: String},
  hse:  {type: String},
  jud:  {type: String},
  com:  {type: String},
  sch:  {type: String},
  wrd:  {type: String},
  cityl:  {type: String},
  munib:  {type: String},
  wtr:  {type: String},
  scm:  {type: String},
  sbd:  {type: String},
  fir:  {type: String},
})

/**
 * Define Schema Indexes for MongoDB
 */

RegisteredVoterSchema.index({ lastName: 1, firstName: 1})

/**
 * Find 'RegisteredVoter' by first name, last name, county and year of birth
 *  @param {String} firstInitial
 *  @param {String} lastName
 *  @param {String} county
 *  @param {String} yearOfBirth
 *  @api public
 */

RegisteredVoterSchema.statics.findRegisteredVoter = function (firstInitial, lastName, county, yearOfBirth) {
  return this.find({ firstName: new RegExp('^'+firstInitial, 'i'), lastName, county, yearOfBirth }).exec()
}

/**
 * Find registered voter by voter registration number
 *
 * @param {String} voterRegistration
 * @api public
 */

 RegisteredVoterSchema.statics.findByVoterRegistration = function (voterRegistration) {
   return this.find({ voterRegistration: voterRegistration }).exec()
 }

/**
 * Expose `RegisteredVoter` Model
 */

module.exports = function initialize (conn) {
  return conn.model('RegisteredVoter', RegisteredVoterSchema)
}
