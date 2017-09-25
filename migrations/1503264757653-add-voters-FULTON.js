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
      csv.fromPath("data/voters_FULTON.csv", {headers: true})
        .on("data", function(data) {

          const fullName = data.name.split(',')
          const lastName = fullName[0].trim();
          const firstName = fullName[1].trim();

          const voterRegistration = data.voterRegistration.trim();
          const registrationDate = data.registrationDate.trim();
          const streetNumber = data.streetNumber.trim();
          const aptNumber = data.aptNumber.trim();
          const streetName = data.streetName.trim();
          const city = data.city.trim();
          const zipCode = data.zipCode.trim();
          const county = data.county.trim();
          const mailingAddress = data.mailingAddress.trim();
          const race = data.race.trim();
          const gender = data.gender.trim();
          const status = data.status.trim();
          const yearOfBirth = data.year_of_birth;
          const specialDesignation = data.specialDesignation.trim();
          const countyPrecinct = data.countyPrecinct.trim();
          const countyPrecinctDescription = data.countyPrecinctDescription.trim();
          const municipalPrecinct = data.municipalPrecinct.trim();
          const municipalPrecinctDescription = data.municipalPrecinctDescription.trim();
          const comboNumber = data.comboNumber.trim();
          const lastVotedDate = data.lastVotedDate.trim();
          const lastVotedParty = data.lastVotedParty.trim();

          const cng = data.cng.trim();
          const sen = data.sen.trim();
          const hse = data.hse.trim();
          const jud = data.jud.trim();
          const com = data.com.trim();
          const sch = data.sch.trim();
          const wrd = data.wrd.trim();
          const cityl = data.cityl.trim();
          const munib = data.munib.trim();
          const wtr = data.wtr.trim();
          const scm = data.scm.trim();
          const sbd = data.sbd.trim();
          const fir = data.fir.trim();

          var voter = new RegisteredVoter({
            voterRegistration,
            registrationDate,
            firstName,
            lastName,
            streetNumber,
            aptNumber,
            streetName,
            city,
            zipCode,
            county,
            mailingAddress,
            race,
            gender,
            status,
            yearOfBirth,
            specialDesignation,
            countyPrecinct,
            countyPrecinctDescription,
            municipalPrecinct,
            municipalPrecinctDescription,
            comboNumber,
            lastVotedDate,
            lastVotedParty,
            cng,
            sen,
            hse,
            jud,
            com,
            sch,
            wrd,
            cityl,
            munib,
            wtr,
            scm,
            sbd,
            fir,
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
