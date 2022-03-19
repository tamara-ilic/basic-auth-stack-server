const User = require('../models/User');

function isLoggedIn(req, res, next) {
    if (req.token && req.token.id) {
        next()
    } else {
        res.sendStatus(401)
    }
    // has token
    // token contains user ID
    // token is not expired
    next()
}

function isPaidAccount(req, res, next) {
    // the user ID is an existing account
    // const user = await User.findById(req.body.UserId)
    // user.accountIsPaid
}

function ownsRequestedProduct(req, res, next) {
    
}

module.exports = {
    isLoggedIn,
    isPaidAccount,
    ownsRequestedProduct
}




