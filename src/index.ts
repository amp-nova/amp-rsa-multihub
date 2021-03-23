const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(process.env.PORT || 4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});