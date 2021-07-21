const express = require('express');
const commentCtrl = require('./comment.controller')
const passport = require("passport")

const router = express.Router();

router.route('/').get(commentCtrl.apiGetComments);

router.route('/add').post(passport.authenticate("jwt", {session:false}), commentCtrl.apiPostComment);

//router.route('/change').post();

router.route('/delete').post(passport.authenticate("jwt", {session:false}), commentCtrl.apiRemoveComment);

module.exports = router;