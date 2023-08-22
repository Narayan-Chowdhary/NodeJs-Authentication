//require the library mongoose
const mongoose = require("mongoose");

//setup connection  to the database
mongoose.connect(
  "mongodb+srv://narayan97nk:9iMTfEsgVESwehuS@cluster0.awfbvzs.mongodb.net/"
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
