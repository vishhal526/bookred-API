const mongoose = require("mongoose");
const Schema = mongoose;
const books = require("./books");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true, 
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true, 
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please enter a valid email",
        ],
    },
    phoneNumber: {
        type: String,
        unique: true, 
        sparse: true, 
        match: [
            /^[0-9]{10}$/, 
            "Please enter a valid phone number",
        ],
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        select: false,
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date, 
    },
    readbooks: [
        {
            type: Schema.Types.ObjectId,
            ref: "books",
        },
    ],
    currentlyReading: {
        type: Schema.Types.ObjectId,
        ref: "books",
    },
    likedbooks: [
        {
            type: Schema.Types.ObjectId,
            ref: "books",
        },
    ],
    favbooks: [
        {
            type: Schema.Types.ObjectId,
            ref: "books",
        },
    ],
});

userSchema.methods.getResetPasswordCode = function () {

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); 

    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetCode;
};

userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});


module.exports = mongoose.model("User", userSchema);