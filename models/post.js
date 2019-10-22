const {Schema, model} = require('mongoose');

const shema = new Schema({
    title: String,
    text: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Post = model('Post', shema)

module.exports = Post