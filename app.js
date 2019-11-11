// Core imports.
const express = require('express')
const Knex = require('knex')
const { Model } = require('objection')

// Middlewares
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

// Custom middleware.
const { unknownEndpoint } = require('./middleware/unknownEndpoint')
const { errorHandler, missedErrorHandler } = require('./middleware/errorHandler')
const { verifyToken } = require('./middleware/verifyToken')

// App config.
const config = require('./utils/config')
const knexConfig = require('./knexfile')

// Database.
const knex = config.NODE_ENV === 'development' ? Knex(knexConfig.development) : Knex(knexConfig.production);
Model.knex(knex);

// Express instance.
const app = express()

// Apply middlewares.
app.use(helmet())
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(config.NODE_ENV === 'development' ? 'dev' : 'tiny'))
app.use(verifyToken)

// Controllers.
const personRouter = require('./controllers/persons')
const projectRouter = require('./controllers/projects')
const taskRouter = require('./controllers/tasks')
const loginRouter = require('./controllers/login')

// Routes.
app.use('/api/persons', personRouter)
app.use('/api/projects', projectRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/login', loginRouter)

app.get('/', (req, res) => {
  res.json('Hello World')
})

// Catch unhandled routes, handle uncatched errors.
app.use(unknownEndpoint)
app.use(errorHandler)
app.use(missedErrorHandler)

module.exports = app
