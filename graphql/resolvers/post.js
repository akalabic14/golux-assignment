const Post = require('../../models/post')
const {promisfy_mongoose} = require('../helper')
const {errorName} = require('../../error-handling')

module.exports = {
/**
 * @function makePost
 * @returns {Object<SimplePost>}
 * @description Creates post for current user for admin and moderator users.
 */
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
                return new_post
            } catch (err) {
                logger.error(err)
                return false
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
/**
 * @function addPost
 * @returns {Object<PostOutput>}
 * @description Creates post with passed title, text and author for admin users.
 */
    addPost: async ({post}, {me}) => {
        const {title, text, author} = post
        const currentUser = await me()
        if (currentUser && currentUser.role == 'admin') {
            try {
                var post = new Post({title, text, author})
                await post.save().populate('author')
                return post
            } catch (err) {
                logger.error(err)
                return false
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
/**
 * @function editPost
 * @returns {Object<PostOutput>}
 * @description Updates title and text on post with passed id for authors of the post and admin users.
 */
    editPost: async ({id, new_title, new_text}) => {
        const currentUser = await me();
        if (currentUser && currentUser.role != 'user') {
            try {
                var post = await promisfy_mongoose(Post.findById(id).populate('author'))
                if (post) {
                    if (currentUser.role == 'admin' || post.author._id.equals(currentUser._id)) {
                        post.title = new_title
                        post.text = new_text
                        await post.save().populate('author')
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
/**
 * @function remove
 * @returns {Boolean}
 * @description Removes post with passed id for authors of the post and admin users.
 */
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
/**
 * @function getMine
 * @returns {Array<SimplePost>}
 * @description Return all posts where curent user is author for moderator and admin users.
 */
    getMine: async (_, {me}) => {
        const currentUser = await me();
        if (currentUser && currentUser.role != 'user') {
            try {
                var all_posts = await promisfy_mongoose(Post.find({
                    author: currentUser.id
                }))
                return all_posts
            } catch (err) {
                logger.error(err)
                return []
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    },
/**
 * @function getAll
 * @returns {Array<PostOutput>}
 * @description Return all posts
 */
    getAll: async (_, {me}) => {
        const currentUser = await me();
        if (currentUser) {
            try {
                var all_posts = await promisfy_mongoose(Post.find().populate('author'))
                let result = all_posts.map(post => {
                    if (currentUser.role == 'user') {
                        return {
                            title: post.title,
                            text: post.text,
                            author: Object.assign({}, {
                                email: post.author.email,
                                role: post.author.role
                            })
                        }
                    } else {
                        return post
                    }
                })
                return result
            } catch (err) {
                logger.error(err)
                return []
            }
        } else {
            throw new Error(errorName.UNAUTHORIZED)
        }
    }
}