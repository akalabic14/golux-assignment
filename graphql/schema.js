const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    input UserInput {
        email: String!,
        password: String!
    }

    type SimpleUser {
        email: String!,
        role: String!
    }

    type UserOutput {
        email: String!,
        role: String!,
        posts: [SimplePost!]!
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

    input PostInput {
        title: String!,
        text: String!
    }

    type PostOutput {
        title: String!,
        text: String!,
        author: UserOutput!
    }
    
    type SimplePost {
        id: String!,
        title: String!,
        text: String!,
        author: UserOutput
    }

    type PostMutations {
        makePost(post: PostInput): SimplePost!
        remove(id: String!): Boolean!
        addPost(title: String!, text: String!, author: String!): SimplePost!
        editPost(id: String!, new_title: String, new_text: String): SimplePost!
    }

    type PostQueries {
        getAll: [PostOutput!]!
        getMine: [SimplePost!]!
    }

    type Query {
        helloGraphQL: String!,
        user: UserQueries,
        post: PostQueries
    }
    type Mutation {
        user: UserMutations,
        post: PostMutations
    }
`)