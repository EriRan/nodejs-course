import { validationResult } from "express-validator";

import { User } from "../models/user.js";


/**
 * Get status of currently logged in user
 */
export async function getStatus(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      status: user.status,
    });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

/**
 * Put a new status for currently logged in user
 */
export async function putStatus(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    user.status = req.body.status;
    const savedUser = await user.save();
    res.status(200).json({
      status: savedUser.status,
    });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}
