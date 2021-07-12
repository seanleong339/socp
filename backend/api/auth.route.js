const express = require("express")
const authCtrl = require("./auth.controller")
const passport = require('passport')

const router = express.Router();

router.route("/register").post(authCtrl.checkNotAuthenticated, authCtrl.registerUser);

router.route("/login").post(authCtrl.checkNotAuthenticated, passport.authenticate('local', {
	successRedirect: '/sample',
	failureRedirect: '/login',
	failureFlash: true
}));

router.route("/logout").post(authCtrl.checkAuthenticated, (req, res) => {
	req.logOut()
	res.redirect('/login')
});

module.exports = router;