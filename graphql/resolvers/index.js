const user = require('./user')
const post = require('./post')

module.exports = {
/**
 * @function helloGraphQL
 * @returns {String}
 * @description Query to test functioning of GraphQL, return Hello {currentUser.email} if some is logged in, Hello GraphQL if no one is logged in
*/
    helloGraphQL: async(_, context) => {
        let currentUser = await context.me();
        return `Hello ${currentUser ? currentUser.email : 'GraphQL'}!`
    },
    user: user,
    post: post
}