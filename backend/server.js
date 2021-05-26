const express = require("express")
const cors = require("cors")
const sample = require("./api/sample.route.js")
const user = require("./api/user.route.js")

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/sample", sample)
app.use("/api/user", user)
app.use("*", (req, res) => {
    res.status(404).json({error:"not found"})
})

module.exports = app;