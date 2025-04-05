const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
    showName: {
        type: String,
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    totalSeats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
    },
    bookedSeats: {
        type: Array,
        default: []
    },
    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre'
    },
})

const Show = mongoose.model('Show', showSchema)

module.exports = Show