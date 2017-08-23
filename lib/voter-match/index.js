var moment = require('moment')
const RegisteredVoter = require('lib/models').RegisteredVoter

/**
 * Search for a registered voter by first initial, last name, county and year of birth.
 * @return if matched, a user object, otherwise null
 */
exports.findRegisteredVoter = function findRegisteredVoter(firstName, lastName, county, dateOfBirth) {
  var firstInitial = firstName.charAt(0);
  var formattedDateOfBirth = moment(dateOfBirth);
  var yearOfBirth = formattedDateOfBirth.year();
  var countyFormatted = county.replace('County', '').trim()

  return RegisteredVoter.findRegisteredVoter(firstInitial.toUpperCase(),
    lastName.toUpperCase(), countyFormatted.toUpperCase(), yearOfBirth)
}
