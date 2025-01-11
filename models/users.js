const mongoose = require("mongoose");
const Schema = mongoose;
const books = require("./books");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
        select: false,

    },
    role: {
        type: String,
        default: "User"
    },
    likedbooks: [{
        type: Schema.Types.ObjectId,
        ref: books
    }],
    favbooks: [{
        type: Schema.Types.ObjectId,
        ref: books
    }]
}
)

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