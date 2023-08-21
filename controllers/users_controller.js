const User = require("../models/user");
const bcrypt = require("bcrypt");

//displaying user Information
module.exports.profile = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    return res.render("profile", {
      title: "User Profile",
      profile_user: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Change password 
module.exports.changePassword = async function (req, res) {
  try {
    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(req.body.currentPassword, user.password);

    if (!match) {
      req.flash("error", "Password doesn't match!");
      return res.redirect("/users/change-password");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
    user.password = hashedPassword;
    await user.save();

    req.flash("success", "Password Changes Successfully");
    return res.redirect("/users/profile");
  } catch (err) {
    console.log("Error in changing password:", err);
    return res.redirect("/users/change-password");
  }
};

//Rendering signup
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signUp", {
    title: "NodeJs Authentication | Sign Up",
  });
};

//Rendering signIn
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }
  return res.render("signIn", {
    title: "NodeJs Authentication | Sign In",
  });
};

//Getting SignUp Data
module.exports.create = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    req.flash("error", "Password Doesn't Matched");
    return res.redirect("back");
  }

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        about: req.body.about,
      });
      req.flash("success", "Signed Up Successfully");
      return res.redirect("/users/sign-in");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("error in finding/creating the user for signup", err);
    return res.status(500).send("Internal Server Error");
  }
};

//Get the SignIn Data
module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in Successfully");
  return res.redirect("/users/profile");
};

// destroy the session
module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error in destroying session", err);
      return res.redirect("/");
    }
    req.flash("success", "Logged Out Successfully");
    res.clearCookie("NodejsAuthentiation");
    return res.redirect("/");
  });
};
