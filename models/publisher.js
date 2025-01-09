const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    website: {
        type: String, 
    },
    contactEmail: {
        type: String, 
    },
    establishedYear: {
        type: Number, 
    },
    socialMedia: {
        facebook: {
            type: String, 
        },
        twitter: {
            type: String, 
        },
        instagram: {
            type: String, 
        }
    },
    description: {
        type: String, 
    },
    logo: {
        type: String, 
    },
});


module.exports = mongoose.model("Publisher", publisherSchema);

