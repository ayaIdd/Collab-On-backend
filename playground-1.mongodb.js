use('test'); // Replace with your actual database name

db.workspaces.find(
  { _id: ObjectId("66b55856c5adad5c49145c9a") },
  { "users.role": 1, _id: 0 }
).pretty();