const express = require('express')
const theatreRouter = express.Router()
const Theatre = require('../models/theatreModel')
const { userAuth } = require('../middleware/auth')

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

module.exports = theatreRouter
