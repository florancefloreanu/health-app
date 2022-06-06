// Load the Mongoose module and Schema object
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Define a new 'UserSchema'
const UserSchema = new Schema({
    id: String,
    password: String,
    firstName: String,
    lastName: String,
    birthdate: String,
    address: String,
    city: String,
    phone: String,
    email: String,
    userType: String,
    userCode: String,
});

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
})

// Create the 'User' model out of the 'UserSchema'
module.exports = mongoose.model('User', UserSchema);