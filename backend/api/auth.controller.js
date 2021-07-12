const bcrypt = require('bcrypt')
const authDAO = require("../dao/authDAO")

class authCtrl {
	static async registerUser(req, res) {
		const hashedpw = await bcrypt.hash(req.body.password, 10)
		const user = {};
		user.username = req.body.username;
		user.email = req.body.email;
		user.password = hashedpw;
		if (authDAO.addUser(user)) {
			console.log('success adding user');
			res.send(true);
			return;
		}
		console.log('cannot add user');
		res.send(false);
	}

	static checkAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			return next()
		}
		const ans = {};
		ans.login = false;
		res.send(ans);
	}

	static checkNotAuthenticated(req, res, next) {
		if (req.isAuthenticated()) {
			res.redirect('/')
		}
		return next();
	}
}

module.exports = authCtrl;