var ApolloServer = require('apollo-server').ApolloServer;
var typeDefs = require('./schemas/typeDefs').typeDefs;
var resolvers = require('./resolvers/resolvers').resolvers;
var server = new ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
server.listen().then(function (_a) {
    var url = _a.url;
    console.log("\uD83D\uDE80  Server ready at " + url);
});
//# sourceMappingURL=index.js.map