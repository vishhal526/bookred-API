const userController = require("../controllers/usercontrollers");
const express = require("express");
router = express.Router();

router.get("/:id?",user);

router.put("/updateName",userController.changeUsername);

router.post("/likebook",userController.addToLikebook);

router.post("/favbook",userController.addToFavBooks);

router.get('/likedbooks/:userID', userController.getlikedbooks);

router.get('/favbooks/:userID', userController.getfavbooks);

router.delete("/unlikebook",userController.unlikebook);

router.delete("/unfavbook",userController.unfavbook);

module.exports = router