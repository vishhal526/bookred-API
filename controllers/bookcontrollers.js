const Book = require('../models/books');
const author = require("../models/authors")
const mongoose = require('mongoose');
// const genre = require("../models/genre");
const multer = require("multer");
const path = require("path");

const getAllBooksweb = async (req, res) => {
  try {

    let books = await Book.find()
      .populate('author')
      .lean();
    books = books.map(book => {
      if (book.image) {
        let imagePath = book.image.split("\\").pop();
        book.image = `${req.protocol}://${req.get('host')}/upload/book_image/${imagePath}`;
      }
      return book;
    });
    res.status(200).json(books);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });

  }
};

const getBookByIdweb = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookid).populate('author').lean();
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Format the image URL
    if (book.image) {
      let imagePath = book.image.split("\\").pop();
      book.image = `${req.protocol}://${req.get('host')}/upload/book_image/${imagePath}`;
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    return cb(null, path.join(__dirname, '..', 'upload', "book_image"));

  },
  filename: function (req, file, cb) {

    return cb(null, `${Date.now()}-${file.originalname}`)

  }
});

const upload = multer({ storage: storage })

const addBook = async (req, res) => {
  try {
    // Destructure the request body
    const {
      bookname,
      image,
      author,
      publicationDate,
      language,
      series,
      synopsis,
      publisher,
      genre,
      pages,
      isbn
    } = req.body;

    // Validate required fields
    if (!bookname || !image || !author || !publisher || !genre || !synopsis || !pages || !isbn) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new book instance
    const newBook = new Book({
      bookname,
      image,
      author,
      publicationDate: publicationDate ? new Date(publicationDate) : undefined,
      language,
      series,
      synopsis,
      publisher,
      genre,
      pages,
      isbn
    });

    // Save the book to the database
    const savedBook = await newBook.save();

    // Respond with the saved book data
    res.status(201).json({
      message: 'Book added successfully',
      book: savedBook
    });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getBookapp = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      return res.status(200).json(book);
    }

    // Retrieve all books
    const books = await Book.find().populate('author','name');
    return res.status(200).json(books);
  } catch (error) {
    console.error("Error = ", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateBook = async(req,res) =>{
  // const { id } = req.params; 
  const { id, bookname, author, image } = req.body; 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' });
  }

  const updateFields = {}; 

  if (bookname) updateFields.bookname = bookname; 
  if (author) updateFields.author = author; 
  if (image) updateFields.image = image; 

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateFields }, 
      { new: true } 
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
}
}

const getRandomBooks = async (req, res) => {
  try {
    // Get a count of total books in the collection
    const count = await Book.countDocuments();

    // If there are fewer than 10 books, adjust the limit
    const limit = Math.min(count, 10);

    // Generate random indices
    const randomIndices = new Set();
    while (randomIndices.size < limit) {
      randomIndices.add(Math.floor(Math.random() * count));
    }

    // Convert Set to Array and sort it
    const indicesArray = Array.from(randomIndices).sort((a, b) => a - b);

    // Fetch books based on the generated random indices
    const randomBooks = await Promise.all(
      indicesArray.map(index => Book.find().skip(index).limit(1))
    );

    // Flatten the array of arrays into a single array of books
    const flattenedBooks = randomBooks.flat();

    // Respond with the random books
    res.status(200).json({
      flattenedBooks
    });
  } catch (error) {
    console.error('Error retrieving random books:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteBookById = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBooksByLike = async (req, res) => {
  try {
    const top = parseInt(req.query.top, 5);

    const likedBooks = await Book.find()
      .sort({ like: -1 })
      .limit(top);
    res.status(200).json(likedBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// const addBookRating = async (req, res) => {
//     try {
//         const { bookId, rating } = req.body;  // Assuming bookId and rating come from the request body
//         const book = await Book.findById(bookId);

//         if (!book) {
//             return res.status(404).send("Book not found");
//         }


//         await book.addRating(rating);

//         return res.status(200).json({
//             message: "Rating added successfully",
//             averageRating: book.rating.average
//         });
//     } catch (err) {
//         return res.status(500).json({ error: err.message });
//     }
// };

module.exports = {
  getAllBooksweb,
  getBookByIdweb,
  getBookapp,
  addBook,
  upload,
  deleteBookById,
  getRandomBooks,
  getBooksByLike,
  updateBook
  // addBookRating
}