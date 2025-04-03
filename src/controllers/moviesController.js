const Movie = require('../models/moviesModel')

// Add new movie
const addMovie = async (req, res) => {
    try {
        const movie = new Movie(req.body)
        await movie.save()
        res.status(200).json({
            success: true,
            message: 'Movie added successfully',
            data: movie,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get all movies
const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find()
        res.status(200).json({
            success: true,
            data: movies
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Get movie by id
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            })
        }
        res.status(200).json({
            success: true,
            data: movie
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Update movie
const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Movie updated successfully',
            data: movie,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// Delete movie
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id)
        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Movie deleted successfully',
            data: movie
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    addMovie,
    getAllMovies,
    getMovieById,
    updateMovie,
    deleteMovie
} 