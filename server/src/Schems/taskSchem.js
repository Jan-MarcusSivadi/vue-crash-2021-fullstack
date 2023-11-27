const mongoose = require("mongoose")

const taskSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    day: {
        type: String,
        required: true
    },
    reminder: {
        type: Boolean,
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

module.exports = {
    Task: mongoose.model('Task', taskSchema)
}