require('lib/models')()

const RegisteredVoter = require('lib/models').RegisteredVoter
const User = require('lib/models').User
const modelsReady = require('lib/models').ready
var findRegisteredVoter = require('lib/voter-match').findRegisteredVoter
var log = require('debug')('democracyos:migration')

// 
/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  modelsReady()
    .then(
      User.findOptInRecords()
        .then((records) => {
          records.forEach(record => {
            findRegisteredVoter(record["firstName"], record["lastName"], record["county"], record["dateOfBirth"])
              .then(function(match) {
                if (match.length !== 1) {                 
                  User.updateUserNeedsReview(record["_id"])
                } else {                                    
                  User.updateUserMatchedVoterRecord(record["_id"], match[0])
                }
              })
          });
        })
    )
  done();
};

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {
  done();
};
