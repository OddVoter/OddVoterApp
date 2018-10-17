/**
 * Get raw topic results report
 *
 * @param {object} topic 
 * @api public
 */
function getRawTopicResults(topic, cb) {
    var async = require('async');
    const Json2csvParser = require('json2csv').Parser;
    var User = require('lib/models').User;
    var RegisteredVoter = require('lib/models').RegisteredVoter;

    const fields = ['lastName','firstName','email','voted','voterOptIn','voterMatched',
                   'zipCode','lastVotedDate','lastVotedParty','municipalPrecinct','gender','race'];
    const json2csvParser = new Json2csvParser({ fields });
    let voters = [];

    return async.each(topic.action.box, function (voter, done) {
        User.findUser(voter.author, function(err, user) {
            if (user) {
                var userObj = {
                    'lastName': user.lastName,
                    'firstName': user.firstName,
                    'email': user.email,
                    'value': voter.value,
                    'voterMatchOptIn': user.voterMatchOptIn,
                    'voterMatched': user.voterMatched
                }
        
                if (user['voterRegistration']) {
                    RegisteredVoter
                    .findByVoterRegistration(user.voterRegistration)
                    .then( (registeredVoter) => {
                        if (registeredVoter !== null) {
                            userObj.zipCode = registeredVoter.zipCode
                            userObj.lastVotedDate = registeredVoter.lastVotedDate
                            userObj.lastVotedParty = registeredVoter.lastVotedParty
                            userObj.municipalPrecinct = registeredVoter.municipalPrecinct
                            userObj.gender = registeredVoter.gender
                            userObj.race = registeredVoter.race
                        }
                        voters.push(userObj);
                        done();
                    })
                } else {
                    voters.push(userObj);
                    done();
                }
            } else {
                done();
            }
        })
    }, function (err, result) {
        const csv = json2csvParser.parse(voters);
        cb(csv)
    });    
}

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
                if (user['voterRegistration']) {
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
                done();
            }
        })
    }, function(err, result) {
        cb({
            'registeredYes' : registeredYes,
            'registeredNo' : registeredNo,
            'registeredNeutral' : registeredNeutral,
            'notRegisteredYes' : notRegisteredYes,
            'notRegisteredNo' : notRegisteredNo,
            'notRegisteredNeutral' : notRegisteredNeutral,
            'grandTotalRegistered' : registeredYes + registeredNeutral + registeredNo,
            'grandTotalNotRegistered' : notRegisteredYes + notRegisteredNeutral + notRegisteredNo,
            'grandTotalYes' : registeredYes + notRegisteredYes,
            'grandTotalNo' : registeredNo + notRegisteredNo,
            'grandTotalNeutral' : registeredNeutral + notRegisteredNeutral
        })
    });
}

/**
 * Get topic poll breakdown based on registered status
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryStatusPoll(topic, cb) {
    var async = require('async');
    var User = require('lib/models').User

    // Create list consisting of each poll item
    var results = []
    topic.action.results.forEach(function (r) {
        results.push({
            'value' : r.value,
            'registered' : 0,
            'notRegistered' : 0,
        })
    })

    // Aggregate results per poll item and registration status
    return async.each(topic.action.box, function (voter, done) {
        User.findUser(voter.author, function(err, user) {
            if (user) {
                // Find index of voter's poll choice
                var index = results.findIndex(function (r) {
                    return r.value === voter.value
                })
                if (index !== -1) {
                    if (user['voterRegistration']) {
                        results[index].registered++
                    }
                    else {
                        results[index].notRegistered++
                    }
                }
                done() 
            } else {
                done()
            }
        })
    }, function (err, result) {
        cb(results)
    });
}

/**
 * Get topic voting breakdown based on district
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryDistrictVote(topic, cb) {
    var async = require('async');
    var User = require('lib/models').User
    var RegisteredVoter = require('lib/models').RegisteredVoter

    var results = []
    return async.each(topic.action.box, function (voter, done) {
        User.findUser(voter.author, function(err, user) {
            if (user) {
                if (user['voterRegistration']) {
                    RegisteredVoter.findByVoterRegistration(user.voterRegistration)
                    .then( (voterRecord) => {
                        if (voterRecord) {
                            var district = parseInt(voterRecord.municipalPrecinct, 10) // Parse district from municipal precinct
                            var index = results.findIndex(function (r) {
                                return r.district == district
                            })
                            if (index === -1) {
                                // Result record has not been created yet, so let's create it
                                var obj = {
                                    'district' : district,
                                    'yes' : 0,
                                    'no' : 0,
                                    'neutral': 0,
                                }
    
                                if (voter.value === 'positive') {
                                    obj.yes = 1
                                } else if (voter.value === 'negative') {
                                    obj.no = 1
                                } else if (voter.value === 'neutral') {
                                    obj.neutral = 1
                                }

                                results.push(obj)
                            } else {
                                // Result record exists, update it with voter's choice
                                if (voter.value === 'positive') {
                                    results[index].yes++
                                } else if (voter.value === 'negative') {
                                    results[index].no++
                                } else if (voter.value === 'neutral') {
                                    results[index].neutral++
                                }   
                            }
                        }
                        done()
                    })    
                } else {
                    var index = results.findIndex(function (r) {
                        return r.district == 'unknown'
                    })
                    if (index === -1) {
                        // Result record has not been created yet, so let's create it
                        var obj = {
                            'district' : 'unknown',
                            'yes' : 0,
                            'no' : 0,
                            'neutral': 0,
                        }

                        if (voter.value === 'positive') {
                            obj.yes = 1
                        } else if (voter.value === 'negative') {
                            obj.no = 1
                        } else if (voter.value === 'neutral') {
                            obj.neutral = 1
                        }

                        results.push(obj)
                    } else {
                        // Result record exists, update it with voter's choice
                        if (voter.value === 'positive') {
                            results[index].yes++
                        } else if (voter.value === 'negative') {
                            results[index].no++
                        } else if (voter.value === 'neutral') {
                            results[index].neutral++
                        }   
                    }
                    done()
                }
            } else {
                done()
            }
        })
    }, function () {
        cb(results)
    });
}

/**
 * Get topic poll breakdown based on district
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryDistrictPoll(topic, cb) {
   var async = require('async');
   var User = require('lib/models').User
   var RegisteredVoter = require('lib/models').RegisteredVoter

   var results = []
   topic.action.results.forEach(function (r) {
       results.push({ item: r.value })
   })

   return async.each(topic.action.box, function (voter, done) {
       // Find the index of object corresponding to voter's poll choice   
       var itemIndex = results.findIndex(function (r) {
           return r.item == voter.value
       });

       if (itemIndex !== -1) {
           User.findUser(voter.author, function(err, user) {
               if (user) {
                   if (user['voterRegistration']) {
                       RegisteredVoter.findByVoterRegistration(user.voterRegistration)
                       .then( (voterRecord) => {
                           if (voterRecord) {
                               var district = parseInt(voterRecord.municipalPrecinct, 10) // Parse district from municipal precinct
                               for (var i = 0; i < results.length; i ++) {
                                   // Iterate through all poll items and seed all districts with 0
                                   // Except for poll item the current user selected, increment district.
                                   if (i == itemIndex) {
                                       if (results[itemIndex][district]) {
                                           // Poll item object has this district, so increment count
                                           results[itemIndex][district]++;
                                        }
                                        else {
                                            // Poll item object doesn't have district, add it to object
                                            results[itemIndex][district] = 1;
                                        }
                                    } else {
                                        if (!results[i][district]) {
                                            results[i][district] = 0;
                                        }
                                    }
                                }
                            }
                            done()
                        })
                    } else {
                        for (var i = 0; i < results.length; i ++) {
                            if (i == itemIndex) {
                                // Add "unknown" district or increment if exists
                                if (results[itemIndex]["unknown"]) {
                                    results[itemIndex]["unknown"]++;
                                } else {
                                    results[itemIndex]["unknown"] = 1;
                                }
                            } else {
                                if (!results[i]["unknown"]) {
                                    results[i]["unknown"] = 0;
                                }
                            }
                        }
                        done()
                    }
                } else {
                    done()
                }   
            })
        } else {
            done()
        }
    }, function () {
        cb(results)
    });
}

/**
 * Get topic voting breakdown based on last voted date
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryDateVote(topic, cb) {
    var async = require('async');
    var User = require('lib/models').User
    var RegisteredVoter = require('lib/models').RegisteredVoter

    var results = []
    return async.each(topic.action.box, function (voter, done) {
        User.findUser(voter.author, function(err, user) {
            if (user) {
                if (user['voterRegistration']) {
                    RegisteredVoter.findByVoterRegistration(user.voterRegistration)
                    .then( (voterRecord) => {
                        if (voterRecord) {
                            var index = results.findIndex(function (r) {
                                return r.lastVotedDate == voterRecord.lastVotedDate
                            })
                            if (index === -1) {
                                // Result record has not been created yet, so let's create it
                                var obj = {
                                    'lastVotedDate' : voterRecord.lastVotedDate,
                                    'yes' : 0,
                                    'no' : 0,
                                    'neutral': 0,
                                }
    
                                if (voter.value === 'positive') {
                                    obj.yes = 1
                                } else if (voter.value === 'negative') {
                                    obj.no = 1
                                } else if (voter.value === 'neutral') {
                                    obj.neutral = 1
                                }
    
                                results.push(obj)
                            } else {
                                // Result record exists, update it with voter's choice
                                if (voter.value === 'positive') {
                                    results[index].yes++
                                } else if (voter.value === 'negative') {
                                    results[index].no++
                                } else if (voter.value === 'neutral') {
                                    results[index].neutral++
                                }   
                            }
                        }
                        done()
                    })    
                } else {
                    var index = results.findIndex(function (r) {
                        return r.lastVotedDate == 'unknown'
                    })
                    if (index === -1) {
                        // Result record has not been created yet, so let's create it
                        var obj = {
                            'lastVotedDate' : 'unknown',
                            'yes' : 0,
                            'no' : 0,
                            'neutral': 0,
                        }

                        if (voter.value === 'positive') {
                            obj.yes = 1
                        } else if (voter.value === 'negative') {
                            obj.no = 1
                        } else if (voter.value === 'neutral') {
                            obj.neutral = 1
                        }

                        results.push(obj)
                    } else {
                        // Result record exists, update it with voter's choice
                        if (voter.value === 'positive') {
                            results[index].yes++
                        } else if (voter.value === 'negative') {
                            results[index].no++
                        } else if (voter.value === 'neutral') {
                            results[index].neutral++
                        }   
                    }
                    done()
                }
            } else {
                done()
            }
        })
    }, function () {
        cb(results)
    });
}

/**
 * Get topic poll breakdown based on last voted date
 *
 * @param {object} topic 
 * @api public
 */
function getTopicSummaryDatePoll(topic, cb) {
    var async = require('async');
    var User = require('lib/models').User
    var RegisteredVoter = require('lib/models').RegisteredVoter

    var results = []
    topic.action.results.forEach(function (r) {
        results.push({ item: r.value })
    })

    return async.each(topic.action.box, function (voter, done) {
        // Find the index of object corresponding to voter's poll choice   
        var itemIndex = results.findIndex(function (r) {
            return r.item == voter.value
        });

        if (itemIndex !== -1) {
            User.findUser(voter.author, function(err, user) {
                if (user) {
                    if (user['voterRegistration']) {
                        RegisteredVoter.findByVoterRegistration(user.voterRegistration)
                        .then( (voterRecord) => {
                            if (voterRecord) {
                                for (var i = 0; i < results.length; i ++) {
                                    // Iterate through all poll items and seed all lastVotedDate's with 0
                                    // Except for poll item the current user selected, increment lastVotedDate.
                                    if (i == itemIndex) {
                                        if (results[itemIndex][voterRecord.lastVotedDate]) {
                                            // Poll item object has this lastVotedDate, so increment count
                                            results[itemIndex][voterRecord.lastVotedDate]++;
                                            }
                                            else {
                                                // Poll item object doesn't have lastVotedDate, add it to object
                                                results[itemIndex][voterRecord.lastVotedDate] = 1;
                                            }
                                        } else {
                                            if (!results[i][voterRecord.lastVotedDate]) {
                                                results[i][voterRecord.lastVotedDate] = 0;
                                            }
                                        }
                                    }
                                }
                                done()
                            })
                        } else {
                            for (var i = 0; i < results.length; i ++) {
                                if (i == itemIndex) {
                                    // Add "unknown" lastVotedDate or increment if exists
                                    if (results[itemIndex]["unknown"]) {
                                        results[itemIndex]["unknown"]++;
                                    } else {
                                        results[itemIndex]["unknown"] = 1;
                                    }
                                } else {
                                    if (!results[i]["unknown"]) {
                                        results[i]["unknown"] = 0;
                                    }
                                }
                            }
                            done()
                        }
                    } else {
                        done()
                    }   
                })
            } else {
                done()
            }
        }, function () {
            cb(results)
        });
}


module.exports = {
    getRawTopicResults,
    getTopicSummaryStatusVote,
    getTopicSummaryStatusPoll,
    getTopicSummaryDistrictVote,
    getTopicSummaryDistrictPoll,
    getTopicSummaryDateVote,
    getTopicSummaryDatePoll,
}