const crypto = require('crypto');
const fs = require('fs');
const jsonwebtoken = require('jsonwebtoken')
const path = require('path')
const jwt = require('jsonwebtoken')

const pathToPrivKey = path.join(__dirname, 'id_rsa_priv.pem')
const PRIV_KEY = fs.readFileSync(pathToPrivKey, 'utf8')

const pathToPubKey = path.join(__dirname, 'id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8')

function genKeyPair() {
	const keyPair = crypto.generateKeyPairSync('rsa', {
		modulusLength: 4096,
		publicKeyEncoding: {
			type: 'pkcs1',
			format: 'pem'
		},
		privateKeyEncoding: {
			type: 'pkcs1',
			format: 'pem'
		}
	})

	fs.writeFileSync(__dirname + '/id_rsa_pub.pem', keyPair.publicKey)


	fs.writeFileSync(__dirname + '/id_rsa_priv.pem', keyPair.privateKey)
}

function issueJWT(user) {
	const email = user.email
	const expiresIn = '1d'

	const payload = {
		email: email,
		iat: Date.now()
	}

	const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
		expiresIn: expiresIn,
		algorithm: 'RS256'
	})

	return {
		token: "Bearer " + signedToken,
		expires: expiresIn
	}
}

function readJWT(token) {
	return jwt.verify(token[1], PUB_KEY)
}

module.exports.issueJWT = issueJWT
module.exports.readJWT = readJWT