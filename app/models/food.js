// load the things we need
const mongoose = require('mongoose');

// define the schema for our food model
const foodSchema = mongoose.Schema({
    name: String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Food', foodSchema);
