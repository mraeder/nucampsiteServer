const mongoose = require('mongoose');      // Workshop 2, Task 1
const Schema = mongoose.Schema;

const partnerSchema = new Schema({      // create a new Mongoose Schema named partnerSchema
    name: {
        type: String,
        unique: true,
        required: true     // All fields should be required... 
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean      // ...except for "featured", and the name should be unique
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true      // Ensure that each document created from this Schema will automatically be given CreatedAt and UpdatedAt fields
});

const Partner = mongoose.model('Partner', partnerSchema);     // Create a Model named Partner from this Schema

module.exports = Partner;    // Export the Partner Model from this module