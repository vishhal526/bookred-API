const express = require('express');
const router = express.Router();
const booksController = require('../controllers/bookcontrollers');
const commentcontrollers = require('../controllers/commentcontrollers');
// const { protect } = require('../controllers/authcontrollers');

// router.get('/',booksController.getAllBooksweb);
// router.get('/:bookid', booksController.getBookByIdweb);

//Get Methods
router.get('/app/:id?', booksController.getBookapp);
  

router.get('/like/:like', booksController.getBooksByLike);

router.get('/comments/:id', commentcontrollers.getallComments);

router.get('/recommend',booksController.getRandomBooks);

//Post Methods
router.post('/add', booksController.upload.single("image"), booksController.addBook);

router.post('/comments/:id', commentcontrollers.addComment);

//Delete Methods
router.delete('/:id', booksController.deleteBookById);

//Patch Method
router.patch("/edit/:id",booksController.updateBook);

module.exports = router;


