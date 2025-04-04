const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())
const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:5173',  // Removed trailing slash
    credentials: true
}))

const connectDB = require('./config/database')

const userAuthRouter = require('./routes/usersRoute')
const movieRouter = require('./routes/moviesRoute')
const theatreRouter = require('./routes/theatreRoute')

// Routes
app.use('/api/users', userAuthRouter)
app.use('/api/movies', movieRouter)
app.use('/api/theatres', theatreRouter)

connectDB().then(() => {
    console.log('Connected to MongoDB...')
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}...`)
    })
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err)
})


