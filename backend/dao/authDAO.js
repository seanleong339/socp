const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

let authCollection;

class authDAO {
	static async injectdb(client) {
		if (authCollection) {
			return;
		}
		try {
			authCollection = await client.db("socplanner").collection("auth");
		} catch (e) {
			console.error(`Error creating auth collection instance ${e}`);
		}
	}

	static async addUser(user) {
		try {
			const reply = await authCollection.insertOne(user);
			return reply.acknowledged;
		} catch (e) {
			console.error(`Error inserting user ${e}`);
		}
	}

	static async findUserbyEmail(email) {
		try {
			const ans = await authCollection.findOne({ "email": { $eq: email } });
			return ans;
		} catch (e) {
			console.error(`Error finding user document ${e}`);
			return null;
		}
	}

	static async findUserbyId(id) {
		try {
			var oid = new ObjectId(id);
			const ans = await authCollection.findOne({ "_id": { $eq: oid } });
			return ans;
		} catch (e) {
			console.error(`Error finding user document ${e}`);
			return null;
		}
	}
	
	//info = {
	//      user: the email of the user
	//	name: true if changing name else dont include field,
	//	password: true if changing password else dont include field,
	//	change: the password or name to change to,
	//	oldpassword: used to authenticate the user identity
	//}
	static async changeUserinfo(info) {
		const filter = {email: info.user}
		if (info.name) {
			try {
				const updateName = { $set: { username: info.change } };
				const result = await authCollection.updateOne(filter, updateName);
				return result;
			} catch (e) {
				console.error(`Error updating name ${e}`);
				return false;
			}
		}
		else if (info.password) {
			try {
				const user = await this.findUserbyEmail(info.user);
				if (await bcrypt.compare(info.oldpassword, user.password)) {
					const hashedpw = await bcrypt.hash(info.change, 10);
					const updatePassword = { $set: { password: hashedpw } };
					const result = await authCollection.updateOne(filter, updatePassword);
					if (result.result.ok == 1) {
						return true;
					}
					else {
						return 'Password not changed'
					}
				}
				else {
					console.log('Wrong old password')
					return 'Wrong old password'
				}
			} catch (e) {
				console.error(`Error updating password ${e}`);
				return 'Error changing password' 
			}
		}
	}
}

module.exports = authDAO;