//require the library mongoose
const mongoose = require("mongoose");

//setup connection  to the database
mongoose.connect(
  "mongodb://localhost:27017/authUser"
);

const db = mongoose.connection;

//if error occurs
db.on("error", function (err) {
  console.log(err.message);
});

db.once("open", function () {
  console.log("Successfully connected to the database");
});

module.exports = db;
