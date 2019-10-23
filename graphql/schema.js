const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    input UserInput {
        email: String!,
        password: String!
    }

    type UserOutput {
        email: String!,
        role: String!
    }

    type UserMutations {
        register(user: UserInput): Boolean!
        login(user: UserInput): Boolean!
        updatePassword(password: String!): Boolean!
        makeModerator(email: String!): Boolean!
        makeAdmin(email: String!): Boolean!
        remove(email: String!): Boolean!
        add(email: String!, password: String!, role: String!): Boolean!
    }

    type UserQueries {
        getAll: [UserOutput!]!
    }

    type Query {
        helloGraphQL: String!,
        user: UserQueries
    }
    type Mutation {
        user: UserMutations
    }
`)