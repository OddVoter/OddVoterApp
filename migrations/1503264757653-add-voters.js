require('lib/models')()

const RegisteredVoter = require('lib/models').RegisteredVoter
const modelsReady = require('lib/models').ready
const mapPromises = (fn) => (array) => Promise.all(array.map(fn))
const csv = require("fast-csv");


/**
 * Make any changes you need to make to the database here
 */
exports.up = function up (done) {
  modelsReady()
    .then(
      csv.fromPath("data/voters.csv", {headers: true})
        .on("data", function(data) {

          const fullName = data.name.split(',')
          const lastName = fullName[0].trim();
          const firstName = fullName[1].trim();

          const county = data.county.trim();
          const yearOfBirth = data.year_of_birth;

          var voter = new RegisteredVoter({
            firstName,
            lastName,
            county,
            yearOfBirth
          });

          voter.save(function(err) {
            if (err) return handleError(err);
          });

          done()
        })
        .on("end", function(){
            console.log("done");
        })
    )
};

/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
exports.down = function down(done) {

  // Clear the collection in the event of undo
  RegisteredVoter.remove({});

  done();
};
