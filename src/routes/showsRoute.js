const express = require('express')
const showsRouter = express.Router()
const Show = require('../models/showsModel')
const { userAuth } = require('../middleware/auth')

showsRouter.post('/add-shows', userAuth, async (req, res) => {
    try {
        const { showName, showTime, date, movie, ticketPrice, totalSeats, availableSeats, theatreId } = req.body
        
        // Create the show document
        const show = new Show({ 
            showName, 
            showTime, 
            date, 
            movie, 
            ticketPrice, 
            totalSeats, 
            availableSeats, 
            theatre: theatreId 
        })
        
        // Save the show
        await show.save()
        
        // Populate the show with movie and theatre details
        const populatedShow = await Show.findById(show._id)
            .populate('movie', 'title')
            .populate('theatre', 'theatreName')
        
        res.status(201).json({ 
            success: true,
            message: 'Show added successfully',
            data: populatedShow
        })
    } catch (error) {
        console.error('Error adding show:', error)
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to add show'
        })
    }
})

showsRouter.get('/get-all-shows', userAuth, async (req, res) => {
    try {
        const shows = await Show.find().populate('movie','title')
        res.status(200).json({ success: true, data: shows })
    } catch (error) {
        console.error('Error fetching shows:', error)
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to fetch shows'
        })
    }
})

// get all shows by theatre id
showsRouter.get('/get-shows-by-theatre/:theatreId', userAuth, async (req, res) => {
    try {
        const theatreId = req.params.theatreId
        const shows = await Show.find({ theatre: theatreId }).populate('movie','title')
        res.status(200).json({ success: true, data: shows })
    } catch (error) {
        console.error('Error fetching shows:', error)
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to fetch shows'
        })
    }
})

showsRouter.put('/edit-show/:showId', userAuth, async (req, res) => {
    try {
        const { showName, showTime, date, movie, ticketPrice, totalSeats, availableSeats, theatreId } = req.body
        const showId = req.params.showId

        const updatedShow = await Show.findByIdAndUpdate(showId, {
            showName,
            showTime,
            date,
            movie,
            ticketPrice,
            totalSeats,
            availableSeats,
            theatre: theatreId
        }, { new: true })

        res.status(200).json({ 
            success: true,
            message: 'Show updated successfully',
            data: updatedShow
        })
    } catch (error) {
        console.error('Error updating show:', error)
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to update show'
        })
    }
})

showsRouter.delete('/delete-show/:showId', userAuth, async (req, res) => {
    try {
        const showId = req.params.showId
        await Show.findByIdAndDelete(showId)

        const shows = await Show.find()

        res.status(200).json({ 
            success: true,
            message: 'Show deleted successfully',
            data: shows
        })
    } catch (error) {
        console.error('Error deleting show:', error)
        res.status(500).json({ 
            success: false,
            message: error.message || 'Failed to delete show'
        })
    }
})

module.exports = showsRouter
