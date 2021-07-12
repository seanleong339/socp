let commentCollection;

const ObjectId = require('mongodb').ObjectId;

class commentDAO {
	static async injectdb(client) {
		if (commentCollection) {
			return;
		}
		try {
			commentCollection = await client.db("socplanner").collection("comments");
		} catch (e) {
			console.error(`Error getting comment collection ${e}`);
		}
	}

	static async getComment({
		filters = null,
		page = 0,
		commentsPerPage = 30
	} = {})
	{

		let query = { "plan": { $eq: filters } };
		let cursor;

		try {
			cursor = await commentCollection.find(query).sort({ date: -1 });
		} catch (e) {
			console.error(`Unable to issue find command ${e}`);
		}

		const displayCursor = cursor.limit(commentsPerPage).skip(commentsPerPage * page);

		try {
			const commentList = await displayCursor.toArray();
			return commentList;
		} catch (e) {
			console.error(`Error converting comments to array ${e}`);
		}

	}

	static async addComment(comment) {
		try {
			await commentCollection.insertOne(comment);
			console.log(true);
			return true;
		} catch (e) {
			console.error(`Error when inserting comment ${e}`);
			console.log(false);
			return false;
		}
	}

	static async removeComment(info) {
		var oid = new ObjectId(info);
		try {
			await commentCollection.deleteOne({ _id: oid });
			return true;
		} catch (e) {
			console.error(`Error deleting comment ${e}`);
			return false;
		}
	}
}

module.exports = commentDAO;