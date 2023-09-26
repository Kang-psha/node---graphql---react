const fs = require("fs");
const path = require("path");

const { print } = require("graphql");
const { loadFilesSync } = require("@graphql-tools/load-files");
const { mergeTypeDefs , mergeResolvers} = require("@graphql-tools/merge");

const resolversArray  = loadFilesSync(path.join(__dirname + "/resolver"));
module.exports = {
    schemaloader: function () {
        const loadedFiles = loadFilesSync(__dirname + "/schema/*.graphql");
        const typeDefs = mergeTypeDefs(loadedFiles);
        const printedTypeDefs = print(typeDefs);
        // data = fs.writeFileSync('joined.graphql', printedTypeDefs)
        return printedTypeDefs;
    },
    resolverloader : mergeResolvers(resolversArray)
};
