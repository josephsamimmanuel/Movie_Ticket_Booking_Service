const express = require('express')
const app = express()
require('dotenv').config()
const userAuthRouter = require('./routes/usersRoute')
app.use(express.json())
const cors = require('cors')
app.use(cors({
    origin: 'http://localhost:5173',  // Removed trailing slash
    credentials: true
}))

const connectDB = require('./config/database')

// Routes
app.use('/api/users', userAuthRouter)

connectDB().then(() => {
    console.log('Connected to MongoDB...')
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}...`)
    })
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err)
})


