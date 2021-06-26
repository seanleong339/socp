const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require("mongodb");
const uri = "mongodb+srv://sean:Orbital2021@cluster0.kacq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

async function createConn() {
  let client = await MongoClient.connect(uri, {
    poolSize: 50,
    wtimeout: 2500,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    return await client.db("socplanner").collection("coursecriteria");
  } catch (e) {
    console.error(`Cannot estab conn with collection ${e}`);
	}
}

class update {

  static async updateCriteria(filters, change, conn) {
    let oid = new ObjectId(filters.id);
    try {
      await conn.updateOne({ _id: oid }, { $set: { elective: change } });
      console.log("success updating criteria");
    } catch (e) {
      console.error(`error updating criteria ${e}`);
    }
  }
}

var filters = {
  id: "60b5e229ee92fb9d71e295e8",
};
var change = 
   [ "is3150","is3240","is3261","is4151","is4228","is4302","is4303","bt3017","cs2105","cs3240","is3221","is4100","is4204","is4234","is4243","is4250","is3251","is4152","is4242","is4241","is4261","is5002","is5128","cs2107","ifs4101","is4231","is4233" ];
createConn().then(conn => {
	update.updateCriteria(filters, change, conn)
}
);