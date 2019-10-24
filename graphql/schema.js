const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    input SimpleUserInput {
        email: String!,
        password: String!
    }

    input UserInput {
        email: String!,
        password: String!,
        role: String!
    }

    type SimpleUser {
        id: String,
        email: String!,
        role: String!
    }

    type UserOutput {
        id: String!,
        email: String!,
        role: String!,
        posts: [SimplePost!]!
    }

    type UserMutations {
        logout: Boolean!
        register(user: SimpleUserInput): Boolean!
        login(user: SimpleUserInput): Boolean!
        updatePassword(password: String!): Boolean!
        makeModerator(email: String!): Boolean!
        makeAdmin(email: String!): Boolean!
        remove(email: String!): Boolean!
        add(user: UserInput): Boolean!
    }

    type UserQueries {
        getAll: [UserOutput!]!
    }

    input SimplePostInput {
        title: String!,
        text: String!
    }

    input PostInput {
        title: String!,
        text: String!,
        author: String!
    }

    type PostOutput {
        id: String,
        title: String!,
        text: String!,
        author: SimpleUser!
    }

    type SimplePost {
        id: String!,
        title: String!,
        text: String!
    }

    type PostMutations {
        makePost(post: SimplePostInput): SimplePost!
        remove(id: String!): Boolean!
        addPost(post: PostInput!): PostOutput!
        editPost(id: String!, new_title: String, new_text: String): PostOutput!
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