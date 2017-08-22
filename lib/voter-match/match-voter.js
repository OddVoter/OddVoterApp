import moment from 'moment'
const RegisteredVoter = require('lib/models').RegisteredVoter

/**
 * Search for a registered voter by first initial, last name, county and year of birth.
 * @return if matched, a user object, otherwise null
 */
module.exports = function findRegisteredVoter(firstName, lastName, county, dateOfBirth) {
  var firstInitial = firstName.charAt(0);
  var formattedDateOfBirth = moment(dateOfBirth);
  var yearOfBirth = formattedDateOfBirth.year();
  
  return RegisteredVoter.findRegisteredVoter(firstInitial, lastName, county, yearOfBirth)
}
