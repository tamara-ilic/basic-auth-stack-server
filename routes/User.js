const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('../utilities/jwt')

router
    .route('/')
    .get(async (request, response) => {
        const users = await User.find({})
        response.json(users)
    })
    .post(async (request, response) => {
        try {
          const user = await User.create(request.body)
          response.send({
            message: 'User created successfully',
            data: user,
            success: true,
            jwt: jwt.generateToken({ id: user._id })
          })
        } catch (error) {
          switch (error.code) {
            case 11000:
              response.status(400).send({
                message:
                  'Email already registered, please try logging in',
                success: false,
                data: error,
              })
              break
            default:
              response.status(400).send({
                message: error.message,
                success: false,
                data: error,
              })
          }
        }
      })

// new user comes to website (anon) - give them anon token/create anon session
// they choose to register/login - attach their user._id to their existing token/session 
// they logout - destroy their token

router    
    .route('/login')
    .post(async (request, response) => {
        console.log(request.body.email, request.body.password)
        try {
            User.authenticate(request.body.email, request.body.password, (error, user) => {
                if(error) {
                    console.log(error)
                    response.send({
                        message: error.message,
                        success: false,
                        data: error,
                      })
                } else {
                    console.log(`${request.body.email} logged in successfully`);
                    response.send({
                        message: 'User logged in successfully',
                        data: user,
                        success: true,
                        jwt: jwt.generateToken({ id: user._id })
                      })
                }
            })
          } catch (error) {
            switch (error.code) {
              default:
                console.log(`${request.body.email} failed to login`)
                response.status(400).send({
                  message: error.message,
                  success: false,
                  data: error,
                })
            }
        }
    })

router.get('/me', async (request, response) => {
    if (request.token.id) {
        try {
            const user = await User.findById(request.token.id)
            if (!user) {
                response.status(400).send({
                    message: 'User not found',
                    success: false,
                    data: user
                })
            } else {
                response.send({
                    message: 'User found',
                    success: true,
                    data: user
                })
            }
        } catch (error) {
            response.status(400).send({
                message: error.message,
                success: false,
                data: error
            })
        }
    } else {
        response.send({
            message: 'You are not logged in',
            success: false
        })
    }
})

router
    .route('/:id')
    .get(async (request, response) => {
        const user = await User.find({ _id: request.params.id })
        response.json(user)
    })
    .put(async (request, response) => {
        const user = await User.findOneAndUpdate(
            { _id: request.params.id },
            request.body,
            // sends back the updated version, which is not the default
            {
                new: true
            }
        )
        response.send(user)
    })
    .delete(async (request, response) => {
        const User = await User.findByIdAndDelete(
            { _id: request.params.id },
            request.body
        )
        response.send(User)
    })

module.exports = router