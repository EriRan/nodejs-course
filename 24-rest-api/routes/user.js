import express from "express";
import isAuth from "../middleware/is-auth.js";
import { getStatus, putStatus } from "../controllers/user.js";

const router = express.Router();

router.get("/status", isAuth, getStatus);
router.put("/status", isAuth, putStatus);

export default router;
