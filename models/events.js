const { stripIgnoredCharacters } = require('graphql');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining the structure of an event object
const eventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Event', eventSchema);