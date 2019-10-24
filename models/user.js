const {Schema, model} = require('mongoose');

const schema = new Schema({
    email: String,
    password: String,
    role: String,
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
})

const User = model('User', schema)

module.exports = User