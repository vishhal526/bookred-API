const express = require('express');
const router = express.Router();
const passport = require("passport");
const { signinuser, loginUser } = require('../controllers/authcontrollers');

router.post('/signin', signinuser);

router.post('/login', loginUser);

module.exports = router;
