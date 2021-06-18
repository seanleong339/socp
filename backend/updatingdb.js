const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require("mongodb");
const uri = "mongodb+srv://sean:Orbital2021@cluster0.kacq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
let conn


MongoClient.connect(uri,
	{ poolSize: 50, wtimeout: 2500, useNewUrlParser: true, useUnifiedTopology: true },
)
	.then(async client => {
		await update.injectDb(client)
})



class update {
	static async injectDb(client) {
		try {
			conn = await client.db("socplanner").collection("coursecriteria");
		} catch (e) {
			console.error(`Cannot estab conn with collection ${e}`);
		}
	}

	static async updateCriteria(filters, change) {
		let oid = new ObjectId(filters.id);
		try {
			await conn.updateOne(
				{ _id: oid },
				{ $set: { elective: change } }
			);
			console.log('success updating criteria')
		} catch (e) {
			console.error(`error updating criteria ${e}`);
		}
	}
}


var filters = {
  id: "60b5e524cf05ec46efa5b8cd"
};
var change = {
    "elective": {
        "lista": ["dba3712", "ie3120", "is3240", "bt4013", "bt4016", "bt4211", "bt4212", "dba4811", "is4241", "is4250", "mkt4812"],
        "listb": ["bt3017", "ie2110", "cs3244", "dba3803", "bse4711", "bt4012", "bt4015", "bt4221", "bt4222", "bt4240", "is4241", "ie4210", "st3131", "st4245"],
        "listc": ["is3107", "is3221", "is3261", "bt4014", "is4228", "is4302"]
    }
}
update.updateCriteria(filters, change);