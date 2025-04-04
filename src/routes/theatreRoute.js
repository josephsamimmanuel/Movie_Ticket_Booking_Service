const express = require('express')
const theatreRouter = express.Router()
const Theatre = require('../models/theatreModel')
const { userAuth } = require('../middleware/auth')

// Add a new theatre
theatreRouter.post('/add-theatre', userAuth, async (req, res) => {
    const { theatreName, address, phoneNumber, email } = req.body
    try {
        const theatre = await Theatre.create({ theatreName, address, phoneNumber, email, createdBy: req.user._id })
        const theatreList = await Theatre.find({ createdBy: req.user._id })
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
        const theatres = await Theatre.find({ createdBy: req.user._id })
        res.status(200).json({
            success: true,
            message: 'Theatres fetched successfully',
            data: theatres
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
        res.status(200).json({
            success: true,
            message: 'Theatre updated successfully',
            data: theatre
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Delete a theatre
theatreRouter.delete('/delete-theatre/:id', userAuth, async (req, res) => {
    try {
        await Theatre.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Theatre deleted successfully'
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = theatreRouter
