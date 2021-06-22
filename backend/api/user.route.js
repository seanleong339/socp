const express = require("express");
const userCtrl = require("./user.controller.js")

const router = express.Router();

router.route('/').post(userCtrl.apiSubmitPlan);
router.route('/check').get(userCtrl.apiCheckPlan);
router.route('/modules').get(userCtrl.apiGetModules)

module.exports = router;