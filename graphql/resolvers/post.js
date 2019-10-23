const Post = require('../../models/post')
const {promisfy_mongoose} = require('../helper')
const {errorName} = require('../../error-handling')

module.exports = {
    makePost: async ({post}, {me}) => {
        const currentUser = await me();
        if (currentUser && currentUser.role != 'user') {
            try {
                var new_post = new Post({
                    author: currentUser.id,
                    title: post.title,
                    text: post.text
                })
    
                await new_post.save()
                new_post.author = currentUser
                return new_post
            } catch (err) {
                logger.error(err)
                return false
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
    addPost: async ({title, text, author}, {me}) => {
        const currentUser = await me();
        if (currentUser && currentUser.role == 'admin') {
            try {
                var post = new Post({title, text, author})
                await post.save()
                post.author = currentUser
                return post
            } catch (err) {
                logger.error(err)
                return false
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
    editPost: async ({id, new_title, new_text}) => {
        const currentUser = await me();
        if (currentUser && currentUser.role != 'user') {
            try {
                var post = await promisfy_mongoose(Post.findById(id).populate('author'))
                if (post) {
                    if (currentUser.role == 'admin' || post.author._id.equals(currentUser._id)) {
                        post.title = new_title
                        post.text = new_text
                        await post.save()
                        return post
                    } else {
                        throw new Error(errorName.UNAUTHORIZED)
                    }
                } else {
                    return false
                }
            } catch (err) {
                logger.error(err)
                return false
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
    remove: async ({id}, {me}) => {
        const currentUser = await me();
        if (currentUser && currentUser.role != 'user') {
            try {
                var post = await promisfy_mongoose(Post.findById(id))
                if (post) {
                    if (currentUser.role == 'admin' || post.author.equals(currentUser._id)) {
                        await promisfy_mongoose(Post.deleteOne({
                            _id: id
                        }))
                        return true
                    } else {
                        throw new Error(errorName.UNAUTHORIZED)
                    }
                } else {
                    return false
                }
            } catch (err) {
                logger.error(err)
                return false
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
    getMine: async (_, {me}) => {
        const currentUser = await me();
        if (currentUser && currentUser.role != 'user') {
            try {
                var all_posts = await promisfy_mongoose(Post.find({
                    author: currentUser.id
                }).populate('author'))
                return all_posts
            } catch (err) {
                logger.error(err)
                return []
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
    getAll: async () => {
        try {
            var all_posts = await promisfy_mongoose(Post.find().populate('author'))
            return all_posts
        } catch (err) {
            logger.error(err)
            return []
        }
    }
}