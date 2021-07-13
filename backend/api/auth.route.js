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
	console.log('logged out')
	res.redirect('/sample')
});

router.route("/check").get((req, res) => {
	res.send(req.isAuthenticated());
})

router.route("/user").get(authCtrl.checkAuthenticated, async (req, res) => {
	console.log(req.user)
	res.json(req.user);
})

module.exports = router;