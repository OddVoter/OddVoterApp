/**
 * Module dependencies.
 */

var log = require('debug')('democracyos:signup')
var utils = require('lib/utils')
var t = require('t-component')
var config = require('lib/config')
var notifier = require('oddvoter-notifier')
var SignupStrategy = require('lib/signup-strategy')
var normalizeEmail = require('lib/normalize-email')
var findRegisteredVoter = require('lib/voter-match').findRegisteredVoter
var User = require('lib/models').User

/**
 * Signups a user
 *
 * @param {Object} profile object with local signup data
 * @param {Object} meta user's ip, user-agent, etc
 * @param {Function} callback Callback accepting `err` and `user`
 * @api public
 */

exports.doSignUp = function doSignUp (profile, meta, callback) {
  log('looking for user with email [%s]', profile.email)
  User.findByEmail(profile.email, function(err, dbUser) {
    if (err) return callback(err)
    log('new user [%s] from Facebook signup [%s]', dbUser.id, profile.email)

    dbUser.homeAddress = profile.homeAddress
    dbUser.county = profile.county
    dbUser.dateOfBirth = profile.dateOfBirth

    // Set opt in status to FALSE if the user never toggled checkbox on registration, since it won't be passed after submit.
    dbUser.voterMatchOptIn = profile.voterMatchOptIn === undefined ? false : true

    // A voter will only attempt to be matched if the user opted in during registration.
    if (dbUser.voterMatchOptIn) {
      findRegisteredVoter(dbUser.firstName, dbUser.lastName, dbUser.county, dbUser.dateOfBirth)
        .then(function(match) {
          dbUser.voterMatched = match ? true : false
        })
    }

    dbUser.save()
      .then(function(err) {
        log('Saved user [%s]', dbUser.id)
        return callback(err, dbUser)
      })
      .catch(function(err) {
        return callback(err)
      })
  })
}
