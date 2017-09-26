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

          const voterRegistration = data.voter_registration.trim();
          const registrationDate = data.registration_date.trim();
          const streetNumber = data.street_number.trim();
          const aptNumber = data.apt_number.trim();
          const streetName = data.street_name.trim();
          const city = data.city.trim();
          const zipCode = data.zip_code.trim();
          const county = data.county.trim();
          const mailingAddress = data.mailing_address.trim();
          const race = data.race.trim();
          const gender = data.gender.trim();
          const status = data.status.trim();
          const yearOfBirth = data.year_of_birth;
          const specialDesignation = data.special_designation.trim();
          const countyPrecinct = data.county_precinct.trim();
          const countyPrecinctDescription = data.county_precinct_description.trim();
          const municipalPrecinct = data.municipal_precinct.trim();
          const municipalPrecinctDescription = data.municipal_precinct_description.trim();
          const comboNumber = data.combo_number.trim();
          const lastVotedDate = data.last_voted_date.trim();
          const lastVotedParty = data.last_voted_party.trim();

          const cng = data.CNG.trim();
          const sen = data.SEN.trim();
          const hse = data.HSE.trim();
          const jud = data.JUD.trim();
          const com = data.COM.trim();
          const sch = data.SCH.trim();
          const wrd = data.WRD.trim();
          const cityl = data.CITYL.trim();
          const munib = data.MUNIB.trim();
          const wtr = data.WTR.trim();
          const scm = data.SCM.trim();
          const sbd = data.SBD.trim();
          const fir = data.FIR.trim();

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
