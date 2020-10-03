const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({     // create a new Mongoose Schema named favoriteSchema
    user: {                             // two fields: user and campsites
        type: mongoose.Schema.Types.ObjectId,   // type of mongoose.Schema.Types.ObjectId, and a ref field to their corresponding Model
        ref: 'User'
    },
    campsites: [{                       // The campsites field's properties should be enclosed in an array
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }]
})

const Favorite = mongoose.model('Favorite', favoriteSchema);  // Create and export a Model named Favorite from this Schema

module.exports = Favorite;