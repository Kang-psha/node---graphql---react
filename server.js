require("./env.js");
const express = require("express");


const path = require("path");
const cors = require("cors");
const graphqlYoga = require("graphql-yoga");
const createFetch = require("@whatwg-node/fetch").createFetch;
const yoga = graphqlYoga.createYoga({
    schema : graphqlYoga.createSchema({
        typeDefs: require("./graphql/loadSchema").schemaloader,
        // fs.readFileSync(path.join(__dirname, "/graphql/schema/Test.graphql"), "utf8")
        resolvers: require("./graphql/loadSchema").resolverloader,
    }),
    // multipart: false,
    fetchAPI: createFetch({
        formDataLimits: {
            // Maximum allowed file size (in bytes)
            fileSize: 100000000,
            // Maximum allowed number of files
            files: 10,
            // Maximum allowed size of content (operations, variables etc...)
            fieldSize: 100000000,
            // Maximum allowed header size for form data
            headerSize: 1000000,
        },
    }),

});

const app = express();
app.use('/ufile', express.static(__dirname + '/graphql/ufile'));
const port = 3000;

// const resolver = require("./grapgql-resolver/resolver");
// const grabSchema = require("./grapgql-schema/schema.grapgql");

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname + "/react-project/build/")));
app.use(express.static(path.join(__dirname + "/react-graphql/build/")));
app.use("/postFile" , express.static(path.join(__dirname + "/graphql/PostFile")));
app.use("/graphql", yoga);

// app.get("/postFile/:postId/:fileName", (req, res) => {
//     // res.sendFile(__dirname + "/grapgql/PostFile/"+ req.params.postId + "/" + );
// });
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/react-project/build/index.html");
});


app.get("/gg", (req, res) => {
    res.sendFile(__dirname + "/react-graphql/build/index.html");
});

// app.get('/*', (req, res) => {
//     console.log("ddd")
//     res.sendFile(__dirname +"/react-project/build/index.html")
// })
