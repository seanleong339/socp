const express = require("express")
const sampleCtrl = require("./sample.controller.js")

const router = express.Router()

router.route("/").get(sampleCtrl.apiGetSamples)
router.route("/voting").post(sampleCtrl.apiUpdateVote)

module.exports = router