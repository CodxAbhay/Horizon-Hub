// We are creating user Toy store male password and usernameto authenticate the user

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// creating the schema for the user model 
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        // unique: true
    }
});
// using the passport local mongoose plugin to hash the password 
// and to authenticate the user and to add 2 more fileds in the database username and password
UserSchema.plugin(passportLocalMongoose);
// exporting the user model
module.exports = mongoose.model('User', UserSchema);
