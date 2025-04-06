const express = require('express')
const theatreRouter = express.Router()
const Theatre = require('../models/theatreModel')
const { userAuth } = require('../middleware/auth')
const Show = require('../models/showsModel')

// Add a new theatre
theatreRouter.post('/add-theatre', userAuth, async (req, res) => {
    const { theatreName, address, phoneNumber, email } = req.body
    try {
        const theatre = await Theatre.create({ theatreName, address, phoneNumber, email, createdBy: req.user._id })
        const theatreList = await Theatre.find({ createdBy: req.user._id }).populate('createdBy', 'name email')
        res.status(201).json({
            success: true,
            message: 'Theatre added successfully',
            data: theatre,
            theatreList: theatreList
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get all theatres
theatreRouter.get('/get-all-theatres', userAuth, async (req, res) => {
    try {
        const theatreList = await Theatre.find()
        console.log(theatreList)
        if (theatreList.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No theatres found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Theatres fetched successfully',
            data: theatreList
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Get all theatres by user id
theatreRouter.get('/get-all-theatres-by-user-id/:userId', userAuth, async (req, res) => {
    try {
        const theatreList = await Theatre.find({ createdBy: req.user._id }).populate('createdBy', 'name email')
        console.log(theatreList)
        if (theatreList.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No theatres found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Theatres fetched successfully',
            data: theatreList
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Update a theatre
theatreRouter.put('/update-theatre/:id', userAuth, async (req, res) => {
    const { theatreName, address, phoneNumber, email } = req.body
    try {
        const theatre = await Theatre.findByIdAndUpdate(req.params.id, { theatreName, address, phoneNumber, email }, { new: true })
        const theatreList = await Theatre.find({ createdBy: req.user._id })
        res.status(200).json({
            success: true,
            message: 'Theatre updated successfully',
            data: theatre,
            theatreList: theatreList
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Delete a theatre
theatreRouter.delete('/delete-theatre/:id', userAuth, async (req, res) => {
    try {
        const deletedTheatre = await Theatre.findByIdAndDelete(req.params.id)
        const theatreList = await Theatre.find({ createdBy: req.user._id })
        res.status(200).json({
            success: true,
            message: 'Theatre deleted successfully',
            data: deletedTheatre,
            theatreList: theatreList
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Accept a theatre
theatreRouter.put('/accept-theatre/:id', userAuth, async (req, res) => {
    const { isActive } = req.body
    try {
        const theatre = await Theatre.findByIdAndUpdate(req.params.id, { isActive, status: 'Approved' }, { new: true })
        res.status(200).json({
            success: true,
            message: 'Theatre accepted successfully',
            data: theatre
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Ignore a theatre
theatreRouter.put('/ignore-theatre/:id', userAuth, async (req, res) => {
    const { isActive } = req.body
    try {
        const theatre = await Theatre.findByIdAndUpdate(req.params.id, { isActive, status: 'Rejected' }, { new: true })
        res.status(200).json({
            success: true,
            message: 'Theatre ignored successfully',
            data: theatre
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// get all unique theatres which have shows for a movie on a given date
theatreRouter.get('/get-all-unique-theatres-for-a-movie/:movieId/:date', userAuth, async (req, res) => {
    try {
        const { movieId, date } = req.params

        // find all shows for a movie on a given date
        const shows = await Show.find({ movie: movieId, date: date }).populate('theatre')
        console.log('shows', shows)

        // Create a map to store theatre objects with their shows
        const theatreMap = new Map()

        // Process each show and organize by theatre
        shows.forEach(show => {
            const theatreId = show.theatre._id.toString()

            if (!theatreMap.has(theatreId)) {
                // Create a new theatre object with shows array inside it
                const theatreObj = {
                    ...show.theatre.toObject(),
                    shows: [show]
                }
                theatreMap.set(theatreId, theatreObj)
            } else {
                // Add show to existing theatre's shows array
                theatreMap.get(theatreId).shows.push(show)
            }
        })

        // Convert map to array of theatre objects
        const theatresWithShows = Array.from(theatreMap.values())
        console.log('theatresWithShows', theatresWithShows)

        res.status(200).json({
            success: true,
            message: 'Theatres fetched successfully',
            data: theatresWithShows
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch theatres'
        })
    }
})

// get show details by show id
theatreRouter.get('/get-show-details/:showId/:date', userAuth, async (req, res) => {
    try {
        const show = await Show.findById(req.params.showId).populate('movie').populate('theatre')
        res.status(200).json({
            success: true,
            message: 'Show details fetched successfully',
            data: show
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = theatreRouter
