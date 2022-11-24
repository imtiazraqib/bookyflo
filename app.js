const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP }  = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

// Setting up GraphQL Scehmas and Resolvers
app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        type RootMutation {
            creatEvent(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['Romantic Cooking', 'Soccer Practice', 'Coding'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(3000);