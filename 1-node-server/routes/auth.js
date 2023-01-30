const path = require("path");

const authController = require("../controllers/auth");

const express = require("express");
const { check, body } = require("express-validator/check");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogout);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        // Example of a custom validator
        if (value === "test@test.com") {
          throw new Error("This email is not allowed");
        }
        return true;
      }),
    body("password", "Password has to be 5 or more characters and alphanumeric")
      .isLength({ min: 5 })
      .isAlphanumeric(),
  ],

  authController.postSignup
);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
