const { readFileSync } = require('fs')
const yaml = require('js-yaml');

console.log(__dirname)

// Reading global settings
const settingsYAML = readFileSync(`${__dirname}/../config/settings.yaml`).toString();

// Converting from YAML to JSON
global.config = yaml.load(settingsYAML)
console.log('Global settings loaded');

const { ApolloServer } = require('apollo-server');
const { typeDefs } = require('./schemas/typeDefs');
const { resolvers } = require('./resolvers/resolvers');

const server = new ApolloServer({ typeDefs, resolvers, playground: true, introspection: true });
server.listen(process.env.PORT || 3000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});