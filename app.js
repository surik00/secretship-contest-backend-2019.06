const uuid = require('uuid/v4')
const express = require('express')
// const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoDBStore = require('connect-mongodb-session')(session)
const config = require('./config')


const app = express()

// Add body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Create session store
const store = new MongoDBStore({
  uri: config.mongoConnectUri,
  collection: 'userSessions',
})

// Catch errors
store.on('error', error => console.log(error))

// Setup app to use session
app.use(session({
  store,
  genid: () => uuid(),
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 1,  // 1 day
  },
}))


// Handlers start here

// Handle index
app.get('/', (req, res) => {
  console.log('Inside homepage')
  console.log('sessionID:', req.sessionID)
  res.status(204).send()
})


// Start server
app.listen(config.port, () => {
  console.log('Listening on localhost, port', config.port)
})