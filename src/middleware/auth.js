const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

const userAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing'
            })
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        // Verify the token
        const isVerified = jwt.verify(token, JWT_SECRET)
        if (!isVerified) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        // Find the user by the user id
        const userId = isVerified.userId
        const user = await User.findOne({_id: userId})
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            })
        }

        // If the user is found, add the user to the request
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        })
    }
}

module.exports = {userAuth}