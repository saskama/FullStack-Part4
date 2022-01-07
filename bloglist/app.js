const config = require('./utils/config')
const logger = require('./utils/logger')

const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
    
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/api/blogs', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app