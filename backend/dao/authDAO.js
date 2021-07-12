const ObjectId = require('mongodb').ObjectId;

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
}

module.exports = authDAO;