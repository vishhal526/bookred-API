// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const saltRounds = 5;

// const jwt_S_K = "WEBookRed@26o5";


// const registerUser = async (req, res) => {
//   try {
//     const { name, password, role } = req.body;

//     const existingUser = await User.findOne({ name });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Set the role based on the request or use a default value
//     const newUser = new User({ name, password: hashedPassword, role: role || "User" });

//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { name, password } = req.body;

//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ userId: user._id, name: user.name, role: user.role }, jwt_S_K, { expiresIn: '1h' });

//     res.status(200).json({ token, userId: user._id, expiresIn: 3600, role: user.role });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = { registerUser, loginUser };

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const saltRounds = 10;

const signinuser = async (req, res) => {
  try {
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

    const { name, password } = req.body;

    // const name = req.body.name;
    // const password = req.body.password;
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

// const protect = async (req, res) => {

//   try {

//     const test_token = req.headers.authorization;
//     let token;

//     if (token && token.startsWith("bearer")) {

//       token = test_token.split(" ")[1];

//     }

//   } catch (error) {
//     return res.status(401).json({ message: "YOu are not authorized" })
//   }

//   const decodedT = await util

// }

module.exports = { signinuser, loginUser, }
// protect

