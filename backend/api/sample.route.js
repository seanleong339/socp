const express = require("express")
const sampleCtrl = require("./sample.controller.js")

const router = express.Router()

router.route("/").get(sampleCtrl.apiGetSamples)

router.route("/comment");

module.exports = router