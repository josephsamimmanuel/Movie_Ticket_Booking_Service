const express = require('express')
const movieRouter = express.Router()
const { addMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } = require('../controllers/moviesController')
const { userAuth } = require('../middleware/auth')

// Routes
movieRouter.post('/add-movie', userAuth, addMovie)
movieRouter.get('/get-all-movies', userAuth, getAllMovies)
movieRouter.get('/get-movie/:id', userAuth, getMovieById)
movieRouter.put('/update-movie/:id', userAuth, updateMovie)
movieRouter.delete('/delete-movie/:id', userAuth, deleteMovie)

module.exports = movieRouter


