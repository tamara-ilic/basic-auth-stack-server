const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('../utilities/jwt')

router
    .route('/')
    .get(async (request, response) => {
        const Users = await User.find({})
        response.json(Users)
    })
    .post(async (request, response) => {
        try {
          const res = await User.create(request.body)
          response.send({
            message: 'User created successfully',
            data: res,
            success: true,
            jwt: jwt.generateToken({ id: response._id })
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

router.get('/me', async (request, response) => {
    if (request.token.id) {
        console.log(request.token.id)
        try {
            const user = await User.findById(request.token.id)
            if (!user) {
                response.status(400).send({
                    message: 'User not found',
                    success: false,
                    data: user
                })
            } else {
                console.log(user)
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
        const User = await User.find({ _id: request.params.id })
        response.json(User)
    })
    .put(async (request, response) => {
        const User = await User.findOneAndUpdate(
            { _id: request.params.id },
            request.body,
            // sends back the updated version, which is not the default
            {
                new: true
            }
        )
        response.send(User)
    })
    .delete(async (request, response) => {
        const User = await User.findByIdAndDelete(
            { _id: request.params.id },
            request.body
        )
        response.send(User)
    })

module.exports = router