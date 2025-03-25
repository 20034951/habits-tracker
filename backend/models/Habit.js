const mongoose = require('mongoose');
const habitSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAt: {
        type:Date,
        default: Date.now
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    lastDone: {
        type: Date,
        default: Date.now
    },
    days: {
        type: Number,
        default: 1
    }
});

module.exports = mongoose.model('Habit', habitSchema);