import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

import axios from 'axios'

const typeDefs = `#graphql
    type Post {
        id: ID
        userId: Int
        title: String
        body: String
    }

    type Todo {
        id: ID
        userId: Int
        title: String
        completed: Boolean
    }

    type Query {
        posts: [Post]
        todos: [Todo]
        post(id: ID): Post
        todo(id: ID): Todo
    }

    type Mutation {
        post(userId: Int, title: String, body: String): Post
        todo(userId: Int, title: String): Todo
    }
`

const resolvers = {
    Query: {
        posts: async () => {
            const { data } = await axios.get(
                'https://jsonplaceholder.typicode.com/posts'
            )
            return data
        },
        todos: async () => {
            const { data } = await axios.get(
                'https://jsonplaceholder.typicode.com/todos'
            )
            return data
        },
        post: async (_, args) => {
            const { data } = await axios.get(
                `https://jsonplaceholder.typicode.com/posts/${args.id}`
            )
            return data
        },
        todo: async (_, args) => {
            const { data } = await axios.get(
                `https://jsonplaceholder.typicode.com/todos/${args.id}`
            )
            return data
        },
    },
    Mutation: {
        post: async (_, args) => {
            const { data } = await axios.post(
                'https://jsonplaceholder.typicode.com/posts',
                { userId: args.userId, title: args.title, body: args.body }
            )
            return data
        },
        todo: async (_, args) => {
            const { data } = await axios.post(
                'https://jsonplaceholder.typicode.com/todos',
                { userId: args.userId, title: args.title, completed: false }
            )
            return data
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
})

console.log(`GraphQL server running on ${url}`)
