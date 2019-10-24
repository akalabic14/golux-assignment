const {Schema, model} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema({
    title: String,
    text: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' }
})

schema.plugin(mongoosePaginate)

schema.index({'$**': 'text'});

const Post = model('Post', schema)

module.exports = Post