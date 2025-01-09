const Publisher = require("../models/publisher");
const Book = require("../models/books");

const addPublisher = async (req, res) => {
    try {
        const {
            name,
            website,
            contactEmail,
            establishedYear,
            socialMedia,
            description,
            logo,
        } = req.body;

        // Check if the publisher already exists (based on the unique name)
        const existingPublisher = await Publisher.findOne({ name });
        if (existingPublisher) {
            return res.status(400).json({ message: 'Publisher with this name already exists.' });
        }

        // Create a new publisher
        const newPublisher = new Publisher({
            name,
            website,
            contactEmail,
            establishedYear,
            socialMedia,
            description,
            logo,
        });

        // Save the new publisher to the database
        const savedPublisher = await newPublisher.save();

        // Send a success response
        res.status(201).json({
            message: 'Publisher added successfully!',
            publisher: savedPublisher
        });
    } catch (error) {
        console.error('Error adding publisher:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deletePublisher = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the publisher by ID
        const deletedPublisher = await Publisher.findByIdAndDelete(id);

        // Check if the publisher exists
        if (!deletedPublisher) {
            return res.status(404).json({ error: "Publisher Not Found" });
        }

        return res.status(200).json({ message: "Publisher Deleted Successfully" });
    } catch (error) {
        console.error("Error While Deleting Publisher =", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

const getPublisher = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            // Retrieve a single author by ID
            const publisher = await Publisher.findById(id);

            if (!publisher) {
                return res.status(404).json({ message: 'Author not found' });
            }

            return res.status(200).json(publisher);
        }

        // Retrieve all authors
        const publishers = await Publisher.find().populate('genre');
        return res.status(200).json(publishers);
    } catch (error) {
        console.error("Error =", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getBooksByPublisher = async (req, res) => {
  try {
      const { publisherId } = req.params;

      // Validate if publisherId is provided
      if (!publisherId) {
          return res.status(400).json({ message: "Publisher ID is required." });
      }

      // Find books by publisher
      const books = await Book.find({ publisher: publisherId });

      // Check if books are found
      if (books.length === 0) {
          return res.status(404).json({ message: "No books found for the specified publisher." });
      }

      // Return the books with a success message
      res.status(200).json(books);
  } catch (error) {
      console.error("Error fetching books by publisher:", error);
      res.status(500).json({ message: "An error occurred while fetching books by publisher.", error: error.message });
  }
};

module.exports = { addPublisher, deletePublisher, getPublisher, getBooksByPublisher }