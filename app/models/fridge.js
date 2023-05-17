// load the things we need
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

// define the schema for our food model
const fridgeSchema = mongoose.Schema({
    user: ObjectID,
    username: String,
    phoneNumber: Number,
    foods: [{
        quantity: Number,
        name: String,
        purchaseDate: Date,
        expirationDate: Date
    }],
    detectedFoodsWithBoxes: String,
    imageFile: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Fridge', fridgeSchema);
