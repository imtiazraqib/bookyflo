const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP }  = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');



const app = express();

const Event = require('./models/events');

app.use(bodyParser.json());

// Setting up GraphQL Scehmas and Resolvers
app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
            type Event {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            input EventInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }
            
            type RootQuery {
                events: [Event!]!
            }
            type RootMutation {
                createEvent(eventInput: EventInput): Event
            }
            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),
        rootValue: {
            events: () => {
                return Event.find().then(events => {
                    return events.map(event => {
                        return {...event._doc};
                    })
                }).catch(err => {
                    throw err;
                })
            },
            createEvent: args => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date)
                });
                return event.save().then(result => {
                    return {...result._doc};
                }).catch(err => {
                    console.log(err);
                    throw err;
                });
            }
        },
        graphiql: true
    })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.kx3gjgj.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})

