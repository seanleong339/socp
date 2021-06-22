let commentCollection;

const ObjectId = require('mongodb').ObjectId;

class commentCtrl {
	static async injectDb(client) {
		if (commentCollection) {
			return;
		}
		try {
			commentCollection = await client.db("socplannner").collection("comments");
		} catch (e) {
			console.error(`Error getting comment collection ${e}`);
		}
	}

	static async addComment(id, comment) {
	}
}