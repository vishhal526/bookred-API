const Author = require("../models/authors");
const Book = require("../models/books");
const multer = require("multer");
const path = require("path");
// const { default: AuthorModel } = require("../../src/AuthorModel");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        return cb(null, path.join(__dirname, "..", "upload", "author_image"));

    },

    filename: function (req, file, cb) {

        return cb(null, `${Date.now()}-${file.originalname}`);

    }

})

const upload = multer({ storage: storage });

const getAllAuthor = async (req, res) => {

    try {

        const authors = await Author.find();
        res.status(200).json(authors);

    } catch (error) {

        console.error(error);
        res.status(500).json({ error: "Internal Server error" })

    }

}

const deleteAuthor = async (req, res) => {
    try {
        const { id } = req.params;

        console.log('Received ID:', id);

        const deleteauthor = await Author.findByIdAndDelete(id);

        if (!deleteauthor) {
            return res.status(404).json({ error: "Author Not Found" });
        }

        return res.status(200).json({ message: "Author Deleted successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const addAuthor = async (req, res) => {
    try {
        const { name, about, follower, facebook, twitter, instagram, website, birthdate } = req.body;
        const image = req.file ? req.file.path : null;

        if (!name || !about || !image) {
            return res.status(400).json({ error: "Name, about, and image are required" });
        }

        const newauthor = await Author.create({
            name,
            image,
            about,
            follower: follower || 0,
            socialMediaLinks: { facebook, twitter, instagram, website },
            birthdate,
        });

        res.status(201).json({ message: "Author Added", author: newauthor });

    } catch (error) {
        console.error("Error = ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const addAuthorApp = async (req, res) => {
    try {
        const { name, about, follower, facebook, twitter, instagram, linkedin, birthdate, image } = req.body;

        // Validate required fields
        if (!name || !about || !image) {
            return res.status(400).json({ error: "Name, about, and image are required" });
        }

        // Create a new author document
        const newAuthor = await Author.create({
            name,
            image,  // Assuming image is passed as a URL or a path to the image
            about,
            follower: follower || 0,
            socialMedia: { facebook, twitter, instagram, linkedin },  // Social media fields
            birthdate,
        });

        // Send a success response
        res.status(201).json({ message: "Author Added", author: newAuthor });

    } catch (error) {
        console.error("Error =", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getBooksByAuthor = async (req, res) => {

    try {

        const { authorID } = req.params;
        const books = await Book.find({ authorauthorId });
        res.json(books);

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

}

const getAuthorapp = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            // Retrieve a single author by ID
            const author = await Author.findById(id);

            if (!author) {
                return res.status(404).json({ message: 'Author not found' });
            }

            return res.status(200).json(author);
        }

        // Retrieve all authors
        const authors = await Author.find().populate('genre');
        return res.status(200).json(authors);
    } catch (error) {
        console.error("Error =", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAuthorbyid = async (req, res) => {

    try {

        const author = await Author.findById(req.params.id);
        if (!author) {
            return res.status(404).json({ message: "Author Not Found" });
        }
        return res.status(200).json(author)

    }
    catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });

    }

}

module.exports = { addAuthor, addAuthorApp, getAuthorapp, upload, getAllAuthor, deleteAuthor, getAuthorbyid, getBooksByAuthor };


