const Genre = require("../models/genre");
const Book = require("../models/books");

const addGenre = async (req, res) => {

    try {

        const name = req.body.name;
        const genre = await Genre.findOne({ name })

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ message: "Genre name is required and must be a non-empty string" });
        }

        if (genre) {

            return res.status(400).json({ message: "Genre already exits" })

        }

        const newgenre = new Genre({ name });
        await newgenre.save();
        res.status(201).json({ message: "Genre added successfully", genre: newgenre })

    } catch (error) {

        console.log("Error Adding Genre = ", error);
        res.status(500).json({ message: "Internal Server Error" })

    }

}

// const getallGenre = async (req, res) => {

//     try {

//         const authors = await Genre.find();
//         res.status(200).json(authors);

//     } catch (error) {

//         console.error(error);
//         res.status(500).json({ error: "Internal Server error" })

//     }

// }

const getBooksByGenre = async (req, res) => {
    try {
        const { genreId } = req.params;

        // Validate if genreId is provided
        if (!genreId) {
            return res.status(400).json({ message: "Genre ID is required." });
        }

        // Find books by genre
        const books = await Book.find({ genre: genreId }).populate({
            path: 'writer.author',
            select: 'name role'
        })
            .lean();

        const responseBooks = books.map(book => ({
            ...book,
            authors: Array.isArray(book.writer) ? book.writer.map(w => ({
                name: w.author ? w.author.name : 'Unknown',
                role: w.role
            })) : [],
        }));
        // Check if books are found
        if (books.length === 0) {
            return res.status(404).json({ message: "No books found for the specified genre." });
        }
        responseBooks.forEach(book => delete book.writer);

        return res.status(200).json(responseBooks);

    } catch (error) {
        console.error("Error fetching books by genre:", error);
        res.status(500).json({ message: "An error occurred while fetching books by genre.", error: error.message });
    }
};

const getRandomGenre = async (req, res) => {    
  try {
    const count = await Genre.countDocuments();

    const limit = Math.min(count, 10);

    const randomIndices = new Set();
    while (randomIndices.size < limit) {
      randomIndices.add(Math.floor(Math.random() * count));
    }

    const indicesArray = Array.from(randomIndices).sort((a, b) => a - b);

    const randomGenre = await Promise.all(
      indicesArray.map(index => Genre.find().skip(index).limit(1))
    );

    const flattenedGenre = randomGenre.flat();

    // Respond with the random books
    res.status(200).json({
      flattenedGenre
    });
  } catch (error) {
    console.error('Error retrieving random Genre:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteGenre = async (req, res) => {

    try {
        const deletedgenre = await Genre.findByIdAndDelete(req.params.id);
        if (!deletedgenre) {
            return res.status(404).json({ error: "Genre Not Found" });
        }
        return res.status(200).json({ message: "Genre Deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }

}

const getGenre = async (req, res) => {
    try {
        const { id } = req.params;

        if (id) {
            // Retrieve a single genre by ID
            const genre = await Genre.findById(id);

            if (!genre) {
                return res.status(404).json({ message: 'Genre not found' });
            }

            return res.status(200).json(genre);
        }

        // Retrieve all genre
        const genres = await Genre.find();
        return res.status(200).json(genres);
    } catch (error) {
        console.error("Error =", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getGenre,
    addGenre,
    getRandomGenre,
    deleteGenre,
    // getallGenre,
    getBooksByGenre
}