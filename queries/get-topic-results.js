cursor = db.getCollection('topics').aggregate([
  { $match: { "_id": ObjectId("5abd39af919fec0004127b05") } },
  { $unwind: "$action.box" },
  { $lookup: {
     "from": "users",
     "localField": "action.box.author",
     "foreignField": "_id",
     "as": "userObject"
  }},
  { $unwind: "$userObject" },
  { $project: {
      "_id": 1,
      "value": "$action.box.value",
      "userObject": 1
  }}
]);
print("lastName,firstName,email,voted,voterOptIn,voterMatched,zipCode,lastVotedDate,lastVotedParty,municipalPrecinct,gender,race" );
while (cursor.hasNext()) {
  bsonObject = cursor.next();

  if (bsonObject["userObject"]["voterMatchOptIn"]) {
    if (bsonObject["userObject"]["voterMatched"]) {
      print(bsonObject["userObject"]["lastName"] + "," + 
            bsonObject["userObject"]["firstName"] + "," +
            bsonObject["userObject"]["email"] + "," + 
            bsonObject["value"] + "," + 
            bsonObject["userObject"]["voterMatchOptIn"] + "," + 
            bsonObject["userObject"]["voterMatched"] + "," + 
            bsonObject["userObject"]["voterRecord"]["zipCode"] + "," + 
            bsonObject["userObject"]["voterRecord"]["lastVotedDate"] + "," + 
            bsonObject["userObject"]["voterRecord"]["lastVotedParty"] + "," + 
            bsonObject["userObject"]["voterRecord"]["municipalPrecinct"] + "," + 
            bsonObject["userObject"]["voterRecord"]["gender"] + "," + 
            bsonObject["userObject"]["voterRecord"]["race"]);
    } else { 
      print(bsonObject["userObject"]["lastName"] + "," + 
            bsonObject["userObject"]["firstName"] + "," +
            bsonObject["userObject"]["email"] + "," + 
            bsonObject["value"] + "," +
            bsonObject["userObject"]["voterMatchOptIn"] + "," +             
            bsonObject["userObject"]["voterMatched"] + ",,,,,,");
    }
  } else {
    print(bsonObject["userObject"]["lastName"] + "," + 
    bsonObject["userObject"]["firstName"] + "," +
    bsonObject["userObject"]["email"] + "," + 
    bsonObject["value"] + ",false,,,,,,,"); // hardcoded 'false' indicates user did not opt in to match their voter record

  }
}