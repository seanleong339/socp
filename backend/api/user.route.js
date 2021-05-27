const express = require("express");
const userCtrl = require("./user.controller.js")

const router = express.Router();

router.route('/').post(userCtrl.apiSubmitPlan);

module.exports = router;