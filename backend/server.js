const express = require("express")
const cors = require("cors")
const sample = require("./api/sample.route.js")
const user = require("./api/user.route.js")

const app = express()

app.use(cors({ origin: true }));
app.use(express.json())

app.use("/sample", sample)
app.use("/", user) //removed api/user
app.use("*", (req, res) => {
    res.status(404).json({error:"not found"})
})

module.exports = app;