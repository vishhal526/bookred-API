const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const validateUser = require('../validation/userValidation');

const saltRounds = 10;

// sign function
const signinuser = async (req, res) => {
  try {

    const validation = validateUser(req.body);
    if (!validation.isValid) {

      return res.status(400).json({ message: validation.message });

    }

    const { name, password, role } = req.body;

    if (!name || typeof name !== 'string' || !password || typeof password !== 'string') {

      return res.status(400).json({ message: 'Name and password are required and must be strings' });

    }

    const existingUser = await User.findOne({ name });

    if (existingUser) {

      return res.status(400).json({ message: 'User already exists' });

    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userRole = role || "User";
    const newUser = new User({ name, password: hashedPassword, role: userRole });
    await newUser.save();
    const token = jwt.sign({ id: newUser._id, name: newUser.name, role: newUser.role }, process.env.SECRET_STR, { expiresIn: "30d" });

    res.status(201).json({

      status: "success",
      token,
      data: newUser,
      message: 'User registered successfully'

    });
  } catch (error) {

    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// login function
const loginUser = async (req, res) => {
  try {

    const validation = validateUser(req.body);
    if (!validation.isValid) {

      return res.status(400).json({ message: validation.message });

    }

    const { name, password } = req.body;
    
    const user = await User.findOne({ name }).select('+password');
    if (!user) {

      return res.status(401).json({ message: 'Please enter correct Name and Password' });

    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    const token = jwt.sign({ userId: user._id, name: user.name, role: user.role }, process.env.SECRET_STR, { expiresIn: process.env.LOGIN_EXPIRE });
    res.status(200).json({ token, message: 'Login Successful' });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });

  }
}

module.exports = { signinuser, loginUser, }

