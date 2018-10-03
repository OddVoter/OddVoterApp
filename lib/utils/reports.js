/**
 * Get topic voting breakdown based on registered status
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryStatusVote(topic, cb) {

    var async = require('async');
    var User = require('lib/models').User

    let registeredNo = 0;
    let registeredYes = 0;
    let registeredNeutral = 0;
    let notRegisteredNo = 0;
    let notRegisteredYes = 0;
    let notRegisteredNeutral = 0;

    return async.each(topic.action.box, function(voter, done) {
        User.findUser(voter.author, function(err, user) {
            if (user) {
                // voterRegistration property is only available in users who have successfully matched with a registered voter record upon signup.
                if ('voterRegistration' in user) {
                    if (voter.value === 'positive') {
                        registeredYes++ 
                    } else if (voter.value === 'negative') {
                        registeredNo++
                    } else if (voter.value === 'neutral') {
                        registeredNeutral++
                    }
                } else {
                    if (voter.value === 'positive') {
                        notRegisteredYes++ 
                    } else if (voter.value === 'negative') {
                        notRegisteredNo++
                    } else if (voter.value === 'neutral') {
                        notRegisteredNeutral++
                    }
                }
                done();
            }
            else {
                done()
            }
        })
    }, function(err, result) {
        cb({
            "registeredYes" : registeredYes,
            "registeredNo" : registeredNo,
            "registeredNeutral" : registeredNeutral,
            "notRegisteredYes" : notRegisteredYes,
            "notRegisteredNo" : notRegisteredNo,
            "notRegisteredNeutral" : notRegisteredNeutral,
            "grandTotalYes" : registeredYes + notRegisteredYes,
            "grandTotalNo" : registeredNo + notRegisteredNo,
            "grandTotalNeutral" : registeredNeutral + notRegisteredNeutral
        })
    });
}

/**
 * Get topic poll breakdown based on registered status
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryRegisteredStatusPoll(topic) {

    var User = require('lib/models').User

    // Create list consisting of each poll item
    results = []
    topic.action.results.forEach(function (r) {
        results.push({
            "value" : r.value,
            "registered" : 0,
            "notRegistered" : 0,
        })
    })

    // Aggregate results per poll item and registration status
    topic.action.box.forEach(function (voter) {
        var user = User.findUser(voter._id)
        if (user !== null) { 
            var index = results.findIndex(function (r) {
                return r.value === voter.value
            })
            if (index !== -1) {
                if (User.isRegisteredVoter(voter._id)) {
                    results[index].registered++
                }
                else {
                    results[index].notRegistered++
                }
            } 
        }
    })

    return results;
}

module.exports = {
    getTopicSummaryStatusVote,
    getTopicSummaryRegisteredStatusPoll
}