const express = require('express')
const userAuthRouter = express.Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { userAuth } = require('../middleware/auth')
require('dotenv').config()
const secretJWT = process.env.SECRET_JWT

// Register a new user
userAuthRouter.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        // check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            })
        }

        // hash password
        const salt = await bcrypt.genSalt(6)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword

        // create new user
        const newUser = new User({
            name: username, // Map username to name field
            email,
            password: hashedPassword
        })
        await newUser.save()

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: newUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        })
    }
})

// Login a user
userAuthRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        // check if user exists
        const existingUser = await User.findOne({ email })
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist'
            })
        }

        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password'
            })
        }

        // generate token
        const token = jwt.sign({ userId: existingUser._id }, secretJWT, { expiresIn: '1h' })

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: existingUser,
            token: token
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        })
    }
})

// Get user details by id
userAuthRouter.get('/get-current-user', userAuth, async (req, res) => {
    try {
        // User is already available from the auth middleware
        const user = await User.findById(req.user._id).select('-password')
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        res.status(200).json({ 
            success: true,
            message: 'User details fetched successfully',
            data: user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error getting user details',
            error: error.message
        })
    }
})


module.exports = userAuthRouter