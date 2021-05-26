const app = require("./server.js")
const mongodb = require("mongodb")
const dotenv = require("dotenv")
const sampleDAO = require("./dao/sampleDAO")

dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT

MongoClient.connect(
    process.env.SOCPLANNER_DB_URI,
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
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`)
        })
    })