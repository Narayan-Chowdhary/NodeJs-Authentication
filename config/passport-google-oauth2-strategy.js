const passport = require("passport");
const googleStretegy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

// using passoport
passport.use(
  new googleStretegy(
    {
      clientID:
        "414009242172-qjjv21556kanvuj2vpb415e22b901ocq.apps.googleusercontent.com", //client ID
      clientSecret: "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", // secret key
      callbackURL:
        "https://developers.coding.com/authentication",  // callback URL
    },
    async ( profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          //setting user as req.user
          return done(null, user);
        } else {
          // create a new user profile
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
            about: "Hi, Welcome to Node.JS Authentication App.",
          });
          return done(null, newUser);
        }
      } catch (err) {
        console.log("error in google strategy-passport", err);
        return done(err);
      }
    }
  )
);

module.exports = passport;
