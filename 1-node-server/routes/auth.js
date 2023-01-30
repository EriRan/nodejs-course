const path = require("path");

const authController = require("../controllers/auth");
const User = require("../models/user");

const express = require("express");
const { check, body } = require("express-validator/check");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email", "Please provide valid email").isEmail(),
    body("password", "Wrong password format")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);
router.get("/signup", authController.getSignup);
router.post("/logout", authController.postLogout);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // If promise is returned, then express will wait for the promise to be fulfilled
        // If promise.reject, then it will be stored as an error
        return User.findOne({ email: value }).then((userDoc) => {
          // If user already exists, redirect back to current page
          if (userDoc) {
            // Throw an error inside a promise
            return Promise.reject("Email exists already. Please pick another");
          }
        });
      }),
    body("password", "Password has to be 5 or more characters and alphanumeric")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match");
      }
      return true;
    }),
  ],

  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
