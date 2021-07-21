const express = require("express")
const bcrypt = require("bcrypt")
const authCtrl = require("./auth.controller")
const authDAO = require("../dao/authDAO")
const util = require("./util")
const passport = require('passport')
const path = require("path")
const fs = require("fs")
const jwt = require("jsonwebtoken")

const pathToKey = path.join(__dirname, "id_rsa_pub.pem")
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

const router = express.Router();

router.route("/register").post(authCtrl.checkNotAuthenticated, authCtrl.registerUser);

router.route("/login").post(async (req, res, next) => {

	const user = await authDAO.findUserbyEmail(req.body.email);
	if (user == null) {
		res.send({
			error: "not found",
			message: "no acc with this email"
		})
		return
	};
	
	try {
		if (await bcrypt.compare(req.body.password, user.password)) {
			const tokenObject = util.issueJWT(user)
			res.status(200).json({
				success: true,
				token: tokenObject.token,
				expiresIn: tokenObject.expiresIn
			})
		}
		else {
			res.send({
				error: "not found",
				message: "wrong password"
			})
			return
		} 
	} catch (e) {
		console.log(e)
		res.send({
			error: "not found",
			reason: e
		}) ;
	}
});

router.route("/logout").post(authCtrl.checkAuthenticated, (req, res) => {
	req.logOut()
	console.log('logged out')
	res.redirect('/sample')
});

router.route("/check").get((req, res) => {
	res.send(req.isAuthenticated());
})

router.route("/user").get(passport.authenticate("jwt", { session: false }), async (req, res) => {
	const token = req.header("Authorization").split(" ")
	const decoded = util.readJWT(token)
	console.log(decoded)
	res.json(decoded)
})

router.route("/changename").post(passport.authenticate("jwt", {session:false}), authCtrl.changeUsername)

router.route("/changepassword").post(passport.authenticate("jwt", {session:false}), authCtrl.changePassword)

router.route("/getname").post(authCtrl.getName)

router.route("/protected").get(passport.authenticate("jwt", { session: false }), (req, res) => {
	res.status(200).json({
		success: true,
		msg: "successful authentication to route"
	})
})

module.exports = router;