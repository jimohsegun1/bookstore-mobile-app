import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  recommendedBooks,
} from "../controller/book.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

// use multer for image storage
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/", protectRoute, getAllBooks);
// router.post("/", protectRoute, createBook);
router.post("/", protectRoute, upload.single("image"), createBook);

router.delete("/:id", protectRoute, deleteBook);
router.get("/user", protectRoute, recommendedBooks);

export default router;
