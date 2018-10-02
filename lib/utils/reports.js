var User = require('lib/models').User

/**
 * Get topic voting breakdown based on registered status
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryStatusVote(topic) {

    let registeredNo = 0;
    let registeredYes = 0;
    let registerdNeutral = 0;
    let notRegisteredNo = 0;
    let notRegisteredYes = 0;
    let notRegisteredNeutral = 0;

    topic.action.box.forEach(function(voter) {
        var user = User.findUser(voter._id)
        if (user !== null) {
            if (User.isRegisteredVoter(voter._id)) {
                if (voter.value === 'positive') {
                    registeredYes++ 
                } else if (voter.value === 'negative') {
                    registeredNo++
                } else if (voter.value === 'neutral') {
                    registerdNeutral++
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
        }
    })
    
    return {
        "registeredYes" : registeredYes,
        "registeredNo" : registeredNo,
        "registeredNeutral" : registerdNeutral,
        "notRegisteredYes" : notRegisteredYes,
        "notRegisteredNo" : notRegisteredNo,
        "notRegisteredNeutral" : notRegisteredNeutral,
        "grandTotalYes" : registeredYes + notRegisteredYes,
        "grandTotalNo" : registeredNo + notRegisteredNo,
        "grandTotalNeutral" : registerdNeutral + notRegisteredNeutral
    }
}

/**
 * Get topic poll breakdown based on registered status
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryRegisteredStatusPoll(topic) {

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