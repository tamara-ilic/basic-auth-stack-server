const mongoose = require('mongoose')

// a schema is a description of what data should look like
const MessageSchema = new mongoose.Schema(
    {
        from: {required: true, type: String},
        to: {required: true, type: String},
        message: {required: true, type: String},
        user: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
)

MessageSchema.pre('find', function() {
    this.populate('user')
})

// model is tool you use to interact with the database
const Message = mongoose.model('Message', MessageSchema)

module.exports = Message