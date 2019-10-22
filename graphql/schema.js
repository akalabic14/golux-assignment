const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    input UserInput {
        email: String!,
        password: String!
    }

    type UserMutations {
        register(user: UserInput): Boolean!
        login(user: UserInput): Boolean!
    }

    type Query {
        helloGraphQL: String!
    }
    type Mutation {
        user: UserMutations
    }
`)