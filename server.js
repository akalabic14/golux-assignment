const express = require('express');
const bodyParser = require('body-parser');
const grapQLHTTP = require('express-graphql');
const mongoose = require('mongoose');


const port = process.env.PORT || 8080;
const app = express();
const { schema, context, resolvers } = require('./graphql');

global.logger = require('tracer').colorConsole({ // .console({
    format: '{{timestamp}} [{{title}}] {{message}} ({{file}}:{{line}})',
    dateformat: 'd mmm yy HH:MM:ss'
})
global.JWT_SECRET = process.env.JWT_SECRET || "my-very-secreeet-akalabic-secret"

app.use(bodyParser.json())

app.use('/graphql', grapQLHTTP((req, res) => ({
    schema: schema,
    rootValue: resolvers,
    context: context(req, res),
    graphiql: true
})))

mongoose.connect('mongodb+srv://web_tehnologije:web_tehnologije@golux-9u8hn.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true})
.then(() => {
    app.listen(port, () => {
        logger.info(`Server online at port ${port}`);
    });
})
.catch(err => {
    logger.error(`Database failed to connect. ${err.toString()}`);
    process.exit(0);
})
