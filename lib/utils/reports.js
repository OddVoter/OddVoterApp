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
                done()
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
        cb (results)
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
   var pollObject = {}
   topic.action.results.forEach(function (r) {
       pollObject[r.value] = 0 // Add all polling items to an object.  This object will be cloned for each district and aggregated on, below.
   })

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
                               var obj = Object.assign({}, pollObject, { 'district': district })
                               obj[voter.value] = 1
                               results.push(obj)
                           } else {
                               // Result record exists, update it with voter's choice
                               results[index][voter.value]++ 
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
                       var obj = Object.assign({}, pollObject, { 'district': 'unknown' })
                       obj[voter.value] = 1
                       results.push(obj)
                   } else {
                       // Result record exists, update it with voter's choice
                       results[index][voter.value]++
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
    var pollObject = {}
    topic.action.results.forEach(function (r) {
        pollObject[r.value] = 0 // Add all polling items to an object.  This object will be cloned for each district and aggregated on, below.
    })

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
                                var obj = Object.assign({}, pollObject, { 'lastVotedDate': voterRecord.lastVotedDate })
                                obj[voter.value] = 1
                                results.push(obj)
                            } else {
                                // Result record exists, update it with voter's choice
                                results[index][voter.value]++ 
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
                        var obj = Object.assign({}, pollObject, { 'lastVotedDate': 'unknown' })
                        obj[voter.value] = 1
                        results.push(obj)
                    } else {
                        // Result record exists, update it with voter's choice
                        results[index][voter.value]++
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


module.exports = {
    getTopicSummaryStatusVote,
    getTopicSummaryStatusPoll,
    getTopicSummaryDistrictVote,
    getTopicSummaryDistrictPoll,
    getTopicSummaryDateVote,
    getTopicSummaryDatePoll,
}