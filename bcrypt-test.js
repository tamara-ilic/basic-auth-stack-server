const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    console.log(err)

    bcrypt.hash('password123', salt, function (err, hash) {
        if (err) return next(err)

        console.log(hash)
    })
})