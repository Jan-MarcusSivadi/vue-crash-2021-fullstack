const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: false
    },
    reminder: {
        type: Boolean,
        required: false
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = {
    Task: mongoose.model('Task', taskSchema)
}