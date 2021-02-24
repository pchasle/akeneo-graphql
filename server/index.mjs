import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import { buildSchema } from 'graphql';

var app = express();
const port = 5000;

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

/*
app.get("/", (req, res) => {
  res.send("Hello World!");
});
*/

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
