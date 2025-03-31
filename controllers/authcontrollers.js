const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const validateUser = require('../validation/userValidation');
const crypto = require('crypto');
// const user = require('../models/users');

const saltRounds = 10;

const algorithm = 'aes-256-cbc'; // Ensure this matches what is used on the frontend
const secretKey = process.env.SECRET_KEY; // Ensure this is a 32-byte key for AES-256

const decryptPassword = (encryptedPassword, encryptedIV) => {
  try {
    // Convert base64-encoded IV back to buffer
    const ivBuffer = Buffer.from(encryptedIV, 'base64');

    // Clean and decode the encrypted password
    const cleaned = encryptedPassword.replace(/-/g, '+').replace(/_/g, '/');
    const encryptedBuffer = Buffer.from(cleaned, 'base64');

    // Create decipher with correct key and IV
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'utf-8'), ivBuffer);

    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final()
    ]);

    return decrypted.toString('utf-8');
  } catch (err) {
    console.error('Decryption error:', err.message);
    throw new Error('Invalid encrypted password.');
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, encryptedPassword, encryptedIV } = req.body;

    console.log("Request Body (reset password) =", req.body);

    if (!email || !encryptedPassword || !encryptedIV) {
      console.log("Didn't get required data");
      return res.status(400).json({ message: "Missing required fields" });
    }

    let decryptedPassword;

    try {
      decryptedPassword = decryptPassword(encryptedPassword, encryptedIV);
    } catch (err) {
      return res.status(400).json({ message: "Password reset failed" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Password reset failed" });
    }

    // Hash the password before saving (assuming you have a hash function)
    user.password = decryptedPassword;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: "An error occurred" });
  }
};


// sign function
// const signinuser = async (req, res) => {
//   try {

//     const validation = validateUser(req.body);
//     if (!validation.isValid) {

//       return res.status(400).json({ message: validation.message });

//     }

//     const { name, password, role } = req.body;

//     if (!name || typeof name !== 'string' || !password || typeof password !== 'string') {

//       return res.status(400).json({ message: 'Name and password are required and must be strings' });

//     }

//     const existingUser = await User.findOne({ name });

//     if (existingUser) {

//       return res.status(400).json({ message: 'User already exists' });

//     }

//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const userRole = role || "User";
//     const newUser = new User({ name, password: hashedPassword, role: userRole });
//     await newUser.save();
//     const token = jwt.sign({ id: newUser._id, name: newUser.name, role: newUser.role }, process.env.SECRET_STR, { expiresIn: "30d" });

//     res.status(201).json({

//       status: "success",
//       token,
//       data: newUser,
//       message: 'User registered successfully'

//     });
//   } catch (error) {

//     res.status(500).json({ message: 'Internal Server Error', error: error.message });
//   }
// };

//checkUsers

const checkUserExists = async (req, res) => {
  const { username, email, phoneNumber } = req.body;

  try {
    let query = null;
    if (username) query = { username };
    else if (email) query = { email };
    else if (phoneNumber) query = { phoneNumber };

    if (!query) {
      return res.status(400).json({ success: false, message: "No valid field provided" });
    }

    const user = await User.findOne(query).select("_id");
    res.status(200).json({ exists: user ? 1 : 0 });

  } catch (error) {
    console.log("Error =", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

//sign function
// const bcrypt = require('bcrypt');

const signinuser = async (req, res) => {
  console.log("Sign in Request Body = ", req.body);
  const validation = validateUser(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ message: validation.message });
  }

  const { email, phone, username, password } = req.body;
  console.log("Received Body:", req.body);

  try {
    if (!email && !phone) {
      return res.status(400).json({ success: false, message: "Email or phone number is required" });
    }

    // Check if the username already exists
    let existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    // Hash the password before saving it
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email: email || null,
      phone: phone || null,
      password: password, // Store the hashed password
    });

    // Save the new user
    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0]; // Get the duplicate field
      return res.status(400).json({ success: false, message: `${field} already registered` });
    }

    res.status(500).json({ success: false, message: error.message });
    console.log("Error Message = ", error.message);
  }
};

// login function
const loginUser = async (req, res) => {
  try {
    // const validation = validateUser(req.body);
    // if (!validation.isValid) {
    //   return res.status(400).json({ message: validation.message });
    // }

    const { loginId, password } = req.body; // loginId can be username, email, or phoneNumber

    const user = await User.findOne({
      $or: [
        { username: loginId },
        { email: loginId },
        { phoneNumber: loginId }
      ]
    }).select('+password'); // Include password field explicitly
    if (!user) {
      console.log("No User Found")
      return res.status(401).json({ message: 'Invalid username credentials.' });
    }

    // Check if the password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    // hashedpassword = await bcrypt.hash(password, 10);
    // console.log("Sent Password when Hashed = ", hashedpassword);

    if (!passwordMatch) {
      console.log("Password Incorrect");
      return res.status(401).json({ message: 'Invalid password credentials.' });
    }

    console.log("User profile picture", user.profilePicture);
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role, pfp: user.profilePicture, email: user.email },
      process.env.SECRET_STR,
      { expiresIn: process.env.LOGIN_EXPIRE }
    );

    res.status(200).json({ token, message: 'Login Successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  loginUser,
  signinuser,
  resetPassword,
  checkUserExists
}