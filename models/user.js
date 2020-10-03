const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');    // This auto adds user and pass to the schema 
const Schema = mongoose.Schema;

const userSchema = new Schema({  // pass this constructor 2 objects as arguments
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
    type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false  // by default, when a new user doc created, admin field will be set to false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);   // export model from this module