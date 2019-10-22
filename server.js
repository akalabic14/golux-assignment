const express = require('express');
const bodyParser = require('body-parser');
const grapQLHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');


const port = process.env.PORT || 8080;
const app = express();
const User = require('./models/user');
const JWT_SECRET = "my-very-secreeet-akalabic-secret"

global.logger = require('tracer').colorConsole({ // .console({
    format: '{{timestamp}} [{{title}}] {{message}} ({{file}}:{{line}})',
    dateformat: 'd mmm yy HH:MM:ss'
})

app.use(bodyParser.json());

app.use('/graphql', grapQLHTTP((req, res) => ({
    schema: buildSchema(`
        type Query {
            helloGraphQL: String!
        }
        type Mutation {
            register(username: String!, password: String!): Boolean!
            login(username: String!, password: String!): Boolean!
        }
    `),
    rootValue: {
        helloGraphQL: async(...args) => {
            let {currentUser} = await args[1]();
            logger.debug(currentUser);
            return `Hello ${currentUser ? currentUser.email : 'GraphQL'}!`
        },
        register: async (args, context) => {
            context = await context();
            const user = new User({
              email: args.username,
              password: args.password
            });
            var saved = await user.save();
      
            const token = jwt.sign(
              {
                userId: saved.id
              },
              JWT_SECRET,
              { expiresIn: "7d" }
            );
      
            context.res.cookie("access_token", token, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            });
      
            return true;
          },
          login: async (args, context) => {
            context = await context();
            const user = await new Promise((resolve) => {
                User.findOne({
                    email: args.username,
                    password: args.password
                },(err, user) => {
                    if(err) {
                        logger.error(err);
                    }
                    resolve(user);
                });
            })
            if (user) {
                logger.debug(user.id);
                const token = jwt.sign(
                    {
                      userId: user.id
                    },
                    JWT_SECRET,
                    { expiresIn: "7d" }
                  );
            
                  context.res.cookie("access_token", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                  });
            
                  return true;
            } else {
                return false
            }
          }
    },
    context: async () => {
        let currentUser = null;
        var cookies = cookie.parse(req.headers.cookie || '');

        if (cookies.access_token) {
            let {userId} = jwt.verify(cookies.access_token, JWT_SECRET);
            logger.debug(userId);
            currentUser = await new Promise((resolve) => {
                User.findById(userId,(err, user) => {
                    if(err) {
                        logger.error(err);
                    }
                    resolve(user);
                });
            })
        }

        return {
            currentUser, res
        };
   },
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
