const mongoose = require('mongoose')

const theatreSchema = new mongoose.Schema({
    theatreName: {
        type: String, 
        required: true
    },
    address: {
        type: String, 
        required: true
    },
    phoneNumber: {
        type: String, 
        required: true
    },
    email: {
        type: String, 
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isActive: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
}, {timestamps: true})

const Theatre = mongoose.model('Theatre', theatreSchema)

module.exports = Theatre

