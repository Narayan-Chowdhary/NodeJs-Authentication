const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
//express layout
const expressLayouts = require("express-ejs-layouts");
//Accessing database
const db = require("./config/mongoose");
//Accessign express Session and setting up
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");
const flash = require("connect-flash");
const customMware = require("./config/middleware");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Accessing mongo store from mongo connect
const MongoStore = require("connect-mongo");

app.use(express.static("./assets"));

app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//setup ejs engine to display data
app.set("view engine", "ejs");
app.set("views", "./views");

//Use of session
app.use(
  session({
    name: "NodejsAuthentiation",
    secret: "something",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    //MongoSession is used to store the session in the db
    store: MongoStore.create(
      {
        mongoUrl:
          "mongodb://localhost:27017/authUser", //mongo connection link
        collectionName: "sessions",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "Connect-Mongodb Setup Ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

//authentication
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//Use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error while runnig server: ${err}`);
  }
  console.log(`Server is running at : ${port}`);
});
