import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import fetch from "node-fetch";
import { ResourceOwnerPassword } from "simple-oauth2";

async function auth() {
  const config = {
    client: {
      id: "3_5mztbe8339k4wsk8ow0wcsw8gwwoo0kss00c8gks4g4wccgow4",
      secret: "a56yx4zji74k8gkko4o8w40wgsosk0g88g4sc8c4scw0okkks",
    },
    auth: {
      tokenHost: "http://localhost:8080",
      tokenPath: "/api/oauth/v1/token",
    },
  };

  const client = new ResourceOwnerPassword(config);

  const accessToken = await client.getToken(
    {
      username: "alkemics_0000",
      password: "406b0baf3",
    },
    {
      json: true,
    }
  );

  return accessToken;
}

var app = express();
const port = 5000;

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Camcorders {
    identifier: String
    name: String
    description: String
  }

  type Query {
    camcorders(identifier: String): Camcorders
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  product: async ({ identifier }) => {
    const response = await fetch(
      `http://localhost:8080/api/rest/v1/products/${identifier}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token.access_token}`,
        },
      }
    );
    const product = await response.json();

    return {
      identifier: product.identifier,
      name: product.values.name[0].value,
      description: product.values.description[0].value,
    };
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

/*
app.get("/", (req, res) => {
  res.send("Hello World!");
});
*/

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
