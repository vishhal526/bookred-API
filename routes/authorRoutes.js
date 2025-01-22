const authorcontrollers = require("../controllers/authorcontrollers");
const express = require("express");
router = express.Router();

router.get("/", authorcontrollers.getAllAuthor);

router.get("/:id",authorcontrollers.getAuthorbyid)

router.get("/app/:authorid?",authorcontrollers.getAuthorapp)

// router.post("/add", authorcontrollers.upload.single("image") ,authorcontrollers.addauthor);

router.post("/add" ,authorcontrollers.addAuthorApp);

router.delete("/delete/:id",authorcontrollers.deleteAuthor);

module.exports = router;