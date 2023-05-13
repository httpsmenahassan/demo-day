// load the things we need
const mongoose = require('mongoose');

// define the schema for our food model
const foodSchema = mongoose.Schema({
    user: String,
    quantity: Number,
    detectedFoods: Array,
    image: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Food', foodSchema);
