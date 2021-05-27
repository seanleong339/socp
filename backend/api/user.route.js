const express = require("express");
const userCtrl = require("./user.controller.js")

const router = express.Router();

router.get('/').get(userCtrl.apiSubmitPlan);

module.exports = router;