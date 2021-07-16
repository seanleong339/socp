const bcrypt = require('bcrypt')
const authDAO = require("../dao/authDAO")

class authCtrl {
	static async registerUser(req, res) {
		const hashedpw = await bcrypt.hash(req.body.password, 10)
		const user = {};
		user.username = req.body.username;
		user.email = req.body.email;
		user.password = hashedpw;
		if (await authDAO.findUserbyEmail(user.email) == null) {
			if (authDAO.addUser(user)) {
				console.log('success adding user');
				res.send(true);
				return;
			}
			console.log('cannot add user');
			res.send(false);
		}
		else {
			console.log('email already in use')
			res.send('email already in use');
		}
	}

	static checkAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next()
		}
		const ans = {};
		ans.login = false;
		console.log(ans)
		res.send(ans);
	}

	static checkNotAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/')
		}
		return next();
	}

	static async changeUsername(req, res) {
		const info = {};
		info.user = req.user.email;
		info.name = true;
		info.change = req.body.change;
		const result = await authDAO.changeUserinfo(info);
		res.send(result.result.ok == 1)
	}

	static async changePassword(req, res) {
		const info = {};
		info.password = true;
		info.user = req.user.email;
		info.change = req.body.change;
		info.oldpassword = req.body.password;
		console.log(info)
		const result = await authDAO.changeUserinfo(info);
		if (result == true) {
			res.send({pass: true});
		}
		else {
			res.send({
				pass: false,
				error: result
			});
		}
	}
}

module.exports = authCtrl;