const {Schema, model} = require('mongoose');

const shema = new Schema({
    email: String,
    password: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})

const User = model('User', shema)

module.exports = User