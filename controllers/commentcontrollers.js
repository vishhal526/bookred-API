const Comment = require('../models/comments');
const mongoose = require('mongoose');
const Book = require('../models/books');
// const { Message } = require('@mui/icons-material');
const comments = require('../models/comments');


const addComment = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { userId, comment } = req.body;

        // Validate inputs
        if (!bookId || !userId || !comment) {
            return res.status(400).json({ message: "bookId, userId, and comment are required." });
        }

        // Create a new comment
        const newComment = await Comment.create({
            userId,
            bookId,
            comment,
        });

        // Update the book with the new comment
        const updatedBook = await Book.findByIdAndUpdate(
            bookId,
            { $push: { comments: newComment._id } },
            { new: true } // Return the updated document
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.status(200).json({ 
            message: "Comment added successfully", 
            comment: newComment 
        });

    } catch (error) {
        console.error("Error =", error);
        res.status(500).json({ 
            message: "Error adding comment", 
            error: error.toString() 
        });
    }
};


const getallComments = async (req, res) => {
    try {
        const { bookId } = req.params;

        // Validate if bookId is provided
        if (!bookId) {
            return res.status(400).json({ message: "Book ID is required." });
        }

        // Find the book and populate its comments
        const book = await Book.findById(bookId).populate({
            path: "comments",
            populate: {
                path: "userId", // Optionally populate user details if needed
                select: "name email", // Include specific user fields
            },
        });

        // Handle case when book is not found
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        res.status(200).json(book.comments);
    } catch (error) {
        console.error("Error fetching comments =", error);
        res.status(500).json({ message: "An error occurred", error: error.toString() });
    }
};


module.exports = { getallComments, addComment }