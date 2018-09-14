require('lib/models')()

const User = require('lib/models').User
const modelsReady = require('lib/models').ready

/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  modelsReady()
    .then(
      User.find({"voterRecord":{$exists:true}})
        .then((records) => {
          if (records.length !== 0) {
            records.forEach(record => {
              User.updateUserMatchedVoterRegistration(record._id, record.voterRecord.voterRegistration)
            });
          }
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
