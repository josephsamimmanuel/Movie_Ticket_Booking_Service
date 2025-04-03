const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    language: {
        type: String, 
        required: true
    },
    genre: {
        type: String, 
        required: true
    },
    releaseDate: {
        type: Date, 
        required: true
    },
    posterUrl: {
        type: String, 
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Movie', movieSchema) 