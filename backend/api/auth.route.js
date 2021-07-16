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
	const user = req.user
	delete user.password
	delete user._id
	console.log(user)
	res.json(user)
})

router.route("/changename").post(authCtrl.checkAuthenticated, authCtrl.changeUsername)

router.route("/changepassword").post(authCtrl.checkAuthenticated, authCtrl.changePassword)

router.route("getname").post(authCtrl.getName)

module.exports = router;