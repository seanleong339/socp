const express = require('express');
const commentCtrl = require('./comment.controller')
const authCtrl = require('./auth.controller')

const router = express.Router();

router.route('/').get(commentCtrl.apiGetComments);

router.route('/add').post(authCtrl.checkAuthenticated, commentCtrl.apiPostComment);

//router.route('/change').post();

//router.route('/delete').post();

module.exports = router;