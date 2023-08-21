//Import passport
const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

//Importing models
const User = require("../models/user");

// Using Local strategy for auth
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    function (req, email, password, done) {
      User.findOne({ email: email })
        .then(async (user) => {
          if (!user) {
            req.flash("error", "Invalid Username/Password");
            return req.res.redirect("/users/sign-in");
          }

          const match = await bcrypt.compare(password, user.password);

          if (!match) {
            req.flash("error", "Invalid Username/Password");
            return req.res.redirect("/users/sign-in");
          }

          return done(null, user);
        })
        .catch((err) => {
          console.log("Error in Finding the User ---> Passport");
          return done(err);
        });
    }
  )
);


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// User from the key in the cookies
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      console.log("Error in Finding the User ---> Passport");
      return done(err);
    });
});

//checking if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is signed in passed on the next function request (controller's action)
  if (req.isAuthenticated()) {
    return next();
  }
  //if the user is not signed-in
  return res.redirect("/users/sign-in");
};


passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
