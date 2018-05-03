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
print("id", "last name", "first name", "voted");
while (cursor.hasNext()) {
  bsonObject = cursor.next();
  print(bsonObject["userObject"]["_id"] + ";" + 
        bsonObject["userObject"]["lastName"] + ", " + 
        bsonObject["userObject"]["firstName"] + ";" + 
        bsonObject["value"]);
}