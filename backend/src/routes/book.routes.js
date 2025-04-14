import express from "express";
import { createBook, deleteBook, getAllBooks, recommendedBooks } from "../controller/book.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllBooks);
router.post("/", protectRoute, createBook);
router.delete("/:id", protectRoute, deleteBook);
router.get("/user", protectRoute, recommendedBooks);

export default router;