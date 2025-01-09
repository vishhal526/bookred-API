const genrecontrollers = require("../controllers/genrecontrollers");
const express = require("express");
const router = express.Router();

// router.get("/",genrecontrollers.getallGenre);

router.get("/:id?", genrecontrollers.getGenre);

router.get('/book/:genreId', genrecontrollers.getBooksByGenre);

router.post("/add", genrecontrollers.addGenre);

router.delete("/delete/:id",genrecontrollers.deleteGenre);

module.exports = router;