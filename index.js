const express = require('express')
const app = express()
const PORT = process.env.PORT || 8080
require('dotenv').config()
const connectToDB = require('./models')
const cors = require('cors')
const messageRouter = require('./routes/Message')
const userRouter = require('./routes/User')
// const session = require('express-session')
const auth = require('./utilities/auth')
const jwt = require('./utilities/jwt')

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET || 'dev_blabla',
//     resave: false,
//     saveUninitialized: true,
//   })
// )
 
// app.use((req, res, next) => {
//   req.session.requestCount = req.session.requestCount
//     ? req.session.requestCount + 1
//     : 1
//   next()
// })
 
app.use((req, res, next) => {
  console.log(req.method, req.path, req.sessionID)
  next()
})
 
app.use(express.json())
app.use(cors())
app.use(jwt.decodeToken) // runs only when request happens, including parenthes makes it run every time
 
app.use('/messages', messageRouter)
app.use('/users', userRouter)

app.get('/loggedInPage', auth.isLoggedIn, (req, res) => {
  // bad practice sending back HTML, should be an error message instead
  res.send(`<html>
    <body>
      <h1>Welcome to the logged in page!</h1>
    </body>
  </html>`)
})

app.get('/downloads/12345432456', auth.ownsRequestedProduct, (req, res) => {
  res.download(`${__dirname}12345432456`)
})

app.get('/set-token', (req, res) =>
  res.send(jwt.generateToken({ id: '5ce819935e539c343f141ece' }))
)
app.get('/verify-token', jwt.verifyToken, (req, res) => res.send(req.user))

// needs to come last to catch all errors
app.use((error, req, res, next) => {
  console.error(error.message)
  res.status(500).send('Something broke!')
})
 
connectToDB().then(() => {
  app.listen(PORT, () => console.log(`Started listening on PORT ${PORT}`))
})
