import Book from "../models/book.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllBooks = async (req, res) => {
    try {
        //example call from react native - frontend
        // const response = await fetch("http://localhost:3000/api/books?page=1&limit=5");
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;
        const totalBooks = await Book.countDocuments();
        const totalPages = Math.ceil(totalBooks / limit);

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage")
            .exec();

        res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages,
        });
    } catch (error) {
        console.log("Error in getAllBooks controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const createBook = async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;

        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = await Book.create({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id,
        });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.log("Error in createBook controller", error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        //delete image from cloudinary
        if (book.image && book.image.includes("cloudinary")) {
            const publicId = book.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`book/${publicId}`);
            } catch (error) {
                console.log("Error deleting image from cloudinary", error.message);
            }
        }

        await Book.findByIdAndDelete(bookId);

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log("Error in deleteBook controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const recommendedBooks = async (req, res) => {
    try {
        const userId = req.user._id;

        // my recommended book
        const books = await Book.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "username profileImage")
            .exec();

        res.status(200).json(books);
    } catch (error) {
        console.log("Error in recommendedBooks controller", error.message);
        res.status(500).json({ message: error.message });
    }
};
