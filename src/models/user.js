const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String },
    email: { type: String },
    password: { type: String },
    avatar: { type: String, default: 'default.png' },
    description: { type: String }
});

module.exports = model('User', userSchema);