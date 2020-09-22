const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({  // pass this constructor 2 objects as arguments
    username: {          // field #1
        type: String,
        required: true,
        unique: true
    },
    password: {          // field #2
        type: String,
        required: true
    },
    admin: {            // field #3
        type: Boolean,
        default: false  // by default, when a new user doc created, admin field will be set to false
    }
});

module.exports = mongoose.model('User', userSchema);   // export model from this module