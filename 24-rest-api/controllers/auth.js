import { User } from "../models/user.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export function signup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "User created",
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  console.log(req.body);
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User with email could not be found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;
        throw error;
      }
      // Create signed JWT token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.jwt_secret,
        {
          expiresIn: "1h",
        }
      );
      // Return the token
      res.status(200).json({token: token, userId: loadedUser._id.toString()})
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
