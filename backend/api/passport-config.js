const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialise(passport, getUserbyEmail, getUserbyId) {
	const authenticateUser = async (email, password, done) => {
		const user = await getUserbyEmail(email);
		if (user == null) {
			return done(null, false, { message: 'No user with that email' });
		}

		try {
			if (await bcrypt.compare(password, user.password)) {
				return done(null, user);
			}
			else {
				return done(null, false, {message: 'Wrong password'})
			} 
		} catch (e) {
			return done(e);
		}
	}

	passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user._id));
	passport.deserializeUser(async (id, done) => {
		const user = await getUserbyId(id)
		return done(null, user)
	});
}

module.exports = initialise;