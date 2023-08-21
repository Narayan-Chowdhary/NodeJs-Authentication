const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require("../controllers/users_controller");

router.get("/profile", passport.checkAuthentication, usersController.profile);

//Creating the SignUp
router.post("/create", usersController.create);

router.get("/sign-up", usersController.signUp);
router.get("/sign-in", usersController.signIn);

//Use Passport as a middleware to authenticate
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "users/sign-in" }),
  usersController.createSession
);

//To signout or Destroy the session
router.get("/sign-out", usersController.destroySession);

// Change password routes
router.get(
  "/change-password",
  passport.checkAuthentication,
  function (req, res) {
    return res.render("change_password", {
      title: "Change Password",
    });
  }
);
router.post(
  "/change-password",
  passport.checkAuthentication,
  usersController.changePassword
);



module.exports = router;
