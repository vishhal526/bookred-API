const express = require('express');
const router = express.Router();
const booksController = require('../controllers/bookcontrollers');
const commentcontrollers = require('../controllers/commentcontrollers');
// const { protect } = require('../controllers/authcontrollers');

// router.get('/',booksController.getAllBooksweb);
// router.get('/:bookid', booksController.getBookByIdweb);

//Get Methods
router.get('/app/:bookid?',booksController.getBookapp);

router.get('/like/:like', booksController.getBooksByLike);

router.get('/:bookId/comments', commentcontrollers.getallComments);

//Post Methods
router.post('/add', booksController.upload.single("image"), booksController.addBook);

router.post('/:bookId/comments', commentcontrollers.addComment);

//Delete Methods
router.delete('/:bookid', booksController.deleteBookById);

module.exports = router;


