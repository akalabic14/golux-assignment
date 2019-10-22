const express = require('express');
const bodyParser = require('body-parser');
const grapQLHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
const port = process.env.PORT || 8080;

global.logger = require('tracer').colorConsole({ // .console({
    format: '{{timestamp}} [{{title}}] {{message}} ({{file}}:{{line}})',
    dateformat: 'd mmm yy HH:MM:ss'
})

const app = express();

app.use(bodyParser.json());

app.use('/graphql', grapQLHTTP({
    schema: buildSchema(`
        type Query {
            helloGraphQL: String
        }
    `),
    rootValue: {
        helloGraphQL: () => {
            return 'Hello GraphQL!'
        }
    },
    graphiql: true
}))

app.listen(port, () => {
    logger.info(`Server online at port ${port}`);
});
