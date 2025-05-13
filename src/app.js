const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())
const cors = require('cors')
const BASE_URL = process.env.BASE_URL
app.use(cors({
    origin: ['http://localhost:5173', 'https://moviebookingjose.netlify.app'],  // Removed trailing slash
    credentials: true
}))

const connectDB = require('./config/database')

const userAuthRouter = require('./routes/usersRoute')
const movieRouter = require('./routes/moviesRoute')
const theatreRouter = require('./routes/theatreRoute')
const showsRouter = require('./routes/showsRoute')

// Routes
app.use('/api/users', userAuthRouter)
app.use('/api/movies', movieRouter)
app.use('/api/theatres', theatreRouter)
app.use('/api/shows', showsRouter)

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}...`)
    })
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err)
})


