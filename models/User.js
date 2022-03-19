const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

// a schema is a description of what data should look like
const UserSchema = new mongoose.Schema(
    {
        name: {required: true, type: String},
        email: {required: true, type: String, unique: true},
        password: {required: true, type: String}
    },
    { timestamps: true }
)

UserSchema.pre('save', function (next) {
    const user = this
    if (!user.isModified('password')) return next()
  
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err)
  
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err)
  
        user.password = hash
        next()
      })
    })
})

UserSchema.statics.authenticate = function (email, password, callback) {
    User.findOne({ email: email }).exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        const err = new Error('User not found.')
        err.status = 401
        return callback(err)
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          return callback(err)
        }
        if (result === true) {
          return callback(null, user)
        } else {
          const err = new Error('Incorrect password.')
          err.status = 402
          return callback(err)
        }
      })
    })
}

// model is tool you use to interact with the database
const User = mongoose.model('User', UserSchema)

module.exports = User