import { validationResult } from "express-validator";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { User } from "../models/user.js";

// ES6 style of getting __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Get status of currently logged in user
 */
export function getStatus(req, res, next) {
  User.findOne({ _id: req.userId })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        status: user.status,
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

/**
 * Put a new status for currently logged in user
 */
export function putStatus(req, res, next) {
  User.findOne({ _id: req.userId })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      user.status = req.body.status;
      return user.save();
    })
    .then(result => {
      res.status(200).json({
        status: result.status,
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
