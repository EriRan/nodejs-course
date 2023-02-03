import { User } from "../models/user.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function signup(req, res, next) {
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

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      name: name,
    });
    const savedUser = await user.save();
    res.status(201).json({
      message: "User created",
      userId: savedUser._id,
    });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function login(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User with email could not be found");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = bcrypt.compare(password, user.password);
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
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
