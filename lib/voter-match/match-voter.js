const RegisteredVoter = require('lib/models').RegisteredVoter

/**
 * Search for a registered voter by first initial, last name, county and year of birth.
 * @return if matched, a user object, otherwise null
 */
module.exports = function findRegisteredVoter(firstInitial, lastName, county, yearOfBirth) {
  return RegisteredVoter.findRegisteredVoter(firstInitial, lastName, county, yearOfBirth)
}
