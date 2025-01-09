const User = require("../models/users");
const books = require("../models/books");

const favbook = async (req, res) => {

    const { userID, bookID } = req.body;

    try {

        await User.findByIdAndUpdate(userID, {

            $addToSet: { favbooks: bookID }

        })

    } catch (error) { }

}

const likebook = async (req, res) => {

    const { userID, bookID } = req.body;

    try {

        await User.findByIdAndUpdate(userID, {

            $addToSet: { likedbooks: bookID }

        });

        return res.status(200).json({ message: "Book Liked successfully" })

    } catch (error) {

        return res.status(500).json({ message: "An Error occured :", error: error })

    };
}

const unlikebook = async (req, res) => {

    const { userID, bookID } = req.body;

    try {

        await User.findByIdAndUpdate(userID, {

            $pull: { likedbooks: bookID }

        });

        return res.status(200).json({ message: "Book unliked successfully" })

    } catch (error) {

        return res.status(500).json({ message: "An Error Occured :", error: error })

    }

}

const getlikedbooks = async (req, res) => {

    const userID = req.params.userID;

    try {

        const userBooks = await User.findById(userID).populate("likedbooks")
        return res.status(200).json(userBooks.likedbooks);

    } catch (error) {

        return res.status(500).json({ message: "An error occured :", error: error })

    }

}

module.exports = { likebook, unlikebook, getlikedbooks }