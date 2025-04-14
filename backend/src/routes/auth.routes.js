import express from "express";
import { login, register } from "../controller/auth.controller.js";

const router = express.Router();

router.get("/forgot-password", (req, res) => {
    res.send("forgot password route");
});
router.post("/register", register);
router.post("/login", login);

export default router;