const user = require('./user')

module.exports = {
    helloGraphQL: async(_, context) => {
        let currentUser = await context.me();
        return `Hello ${currentUser ? currentUser.email : 'GraphQL'}!`
    },
    user: user
}