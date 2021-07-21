const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');

const pathToKey = path.join(__dirname, "id_rsa_pub.pem");

const PUB_KEY = fs.readFileSync(pathToKey, "utf8")

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ["RS256"]
}

function initialise(passport, getUserbyEmail, getUserbyId) {
	const authenticateUser = async (jwt_payload, done) => {
		const user = await getUserbyEmail(jwt_payload.email);
		if (user == null) {
			return done(null, false);
		}
		else {
			return done(null, user);
		}

	}

	passport.use(new JwtStrategy(options, authenticateUser));
}

module.exports = initialise;