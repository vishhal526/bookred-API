const User = require("../models/users");
const books = require("../models/books");

const addToFavBooks = async (req, res) => {
    const { userID, bookID } = req.body;

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(bookID)) {
        return res.status(400).json({ message: "Invalid userID or bookID format" });
    }

    try {
        // Check if user exists
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if book is already in favbooks array
        if (user.favbooks.includes(bookID)) {
            return res.status(400).json({ message: "Book already added to favorites" });
        }

        // Add the book to the favbooks array
        await User.findByIdAndUpdate(userID, {
            $addToSet: { favbooks: bookID }
        });

        return res.status(200).json({ message: "Book added to favorites successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const addToLikebook = async (req, res) => {
    const { userID, bookID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userID) || !mongoose.Types.ObjectId.isValid(bookID)) {
        return res.status(400).json({ message: "Invalid userID or bookID format" });
    }

    try {

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.likedbooks.includes(bookID)) {
            return res.status(400).json({ message: "Book already liked" });
        }

        await User.findByIdAndUpdate(userID, {
            $addToSet: { likedbooks: bookID }
        });

        return res.status(200).json({ message: "Book liked successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

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

};

const getRandomBooks = async (req, res) => {
    try {
        // Use MongoDB's aggregation to randomly select 10 books
        const randomBooks = await books.aggregate([
            { $sample: { size: 10 } } // Randomly sample 10 documents
        ]);

        if (randomBooks.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }

        return res.status(200).json({ message: "Random books fetched successfully", data: randomBooks });
    } catch (error) {
        console.error("Error fetching random books:", error.message);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const unfavbook = async (req, res) => {
    const { userID, bookID } = req.body;

    try {

        await User.findByIdAndUpdate(userID, {
            $pull: { favbooks: bookID }
        });

        return res.status(200).json({ message: "Book removed from favorites successfully" });

    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const getfavbooks = async (req, res) => {
    const userID = req.params.userID;

    try {

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userBooks = await User.findById(userID).populate("favbooks");

        return res.status(200).json(userBooks.favbooks);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const getlikedbooks = async (req, res) => {
    const userID = req.params.userID;

    try {

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userBooks = await User.findById(userID).populate("likedbooks");

        return res.status(200).json(userBooks.likedbooks);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const changeUsername = async (req, res) => {
    try {
        const userId = req.user._id;
        const { newName } = req.body;


        if (!newName || typeof newName !== 'string' || newName.trim().length === 0) {
            return res.status(400).json({ message: 'Invalid username. Please provide a valid name.' });
        }


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name: newName },
            { new: true, runValidators: true }
        );


        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }


        res.status(200).json({
            message: 'Username updated successfully',
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                role: updatedUser.role,
                likedbooks: updatedUser.likedbooks,
                favbooks: updatedUser.favbooks
            }
        });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { addToLikebook, addToFavBooks, getRandomBooks, unlikebook, unfavbook, getlikedbooks, changeUsername, getfavbooks }