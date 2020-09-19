const mongoose = require('mongoose');    // Workshop 2 Task 2 In the nucampsiteServer/models folder, create a new file named promotion.js
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;    // Use the mongoose-currency library's Currency type for the cost field

const promotionSchema = new Schema({     // create a new Mongoose Schema named promotionSchema
    name: {
        type: String,
        unique: true,
        required: true   // All fields should be required...
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean     // ...except for "featured", and the name should be unique
    },
    cost: {
        type: Currency,   // Use the mongoose-currency library's Currency type for the cost field
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true   // Ensure that each document created from this Schema will automatically be given CreatedAt and UpdatedAt fields
});

const Promotion = mongoose.model('Promotion', promotionSchema);   // reate a Model named Promotion from this Schema

module.exports = Promotion;   // Export the Promotion Model from this module