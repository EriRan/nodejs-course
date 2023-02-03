import express from "express";
import isAuth from "../middleware/is-auth.js";
import { getStatus, putStatus } from "../controllers/user.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/status", isAuth, getStatus);
router.put(
  "/status",
  isAuth,
  [
    body("status").trim().not().isEmpty(),
    body("status").trim().isLength({ max: 300 }),
  ],
  putStatus
);

export default router;
