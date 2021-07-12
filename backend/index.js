const app = require("./server.js")
const mongodb = require("mongodb")
const dotenv = require("dotenv")
const sampleDAO = require("./dao/sampleDAO")
const criteriaDAO = require("./dao/criteriaDAO")
const commentDAO = require("./dao/commentDAO")
const authDAO = require("./dao/authDAO")

dotenv.config();

const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || "5000";

MongoClient.connect(
    "mongodb+srv://sean:Orbital2021@cluster0.kacq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        poolSize: 50,
        wtimeout: 2500,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
    .catch(err => {
        console.error(err.stack);
        process.exit(1)
    }
    )
    .then(async client => {
        await sampleDAO.injectdb(client)
        await criteriaDAO.injectdb(client)
        await commentDAO.injectdb(client)
        await authDAO.injectdb(client)
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    });