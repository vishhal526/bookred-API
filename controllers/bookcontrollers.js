const Book = require('../models/books');
const author = require("../models/authors")
const mongoose = require('mongoose');
// const genre = require("../models/genre");
const multer = require("multer");
const path = require("path");

// const getAllImg = async (req, res) => {  
//   try {  
//       let images = await Book.find();  

//       images = images.map(image => {  
//           if (image.image) {  
//               // This assumes image.image gives a path starting with G: and uses \ as separator
//               let imagePath = image.image.split("\\").pop();
//               image.image = `${req.protocol}://${req.get('host')}/upload/${imagePath}`;
//           }  
//           return image;  
//       });  

//       res.status(200).json(images);  

//   } catch (error) {  
//       console.error(error);  
//       res.status(500).json({ error: 'Internal Server Error' });  
//   }  
// };

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

    // Define allowed fields
    const allowedFields = ['bookname', 'author', 'description'];
    const filteredBody = {};

    // Filter req.body to include only allowed fields
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        filteredBody[field] = req.body[field];
      }
    });

    // Add image and genre processing
    filteredBody.image = req.file ? req.file.path : null;
    filteredBody.genre = req.body.genre.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));

    const newBook = await Book.create(filteredBody);
    res.status(201).json({ newBook, message: 'Book Added successfully' });
  } catch (error) {
    console.error("Error = ", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getBookapp = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const book = await Book.findById(id).populate('genre');

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      return res.status(200).json(book);
    }

    // Retrieve all books
    const books = await Book.find().populate('genre');
    res.status(200).json(books);
  } catch (error) {
    console.error("Error = ", error);
    res.status(500).json({ error: 'Internal Server Error' });
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
  getBooksByLike,
  // addBookRating
}; 