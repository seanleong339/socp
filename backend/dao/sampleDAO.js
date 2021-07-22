let sample
const ObjectId = require("mongodb").ObjectId;

class sampleDAO {
    static async injectdb(conn) {
        if (sample) {
            return;
        }
        try {
            sample = await conn.db("socplanner").collection("studyplan");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in SampleDAO ${e}`
            )
        }
    }

    static async getPlan({
        filters = null,
        page = 0,
        plansPerPage = 30 
    } = {})
    {
        plansPerPage = 30;
        let query
        if (filters) {
            if (filters.major) {
                query = {"major": {$eq: filters["major"]}}
            }
            if (filters.specialisation) {
                query = {"specialisation": {$eq: filters["specialisation"]}}
            }
        }

        console.log(query)

        let cursor

        try {
            cursor = await sample.find(query).sort({ votes: -1 });
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return {planList: []}
        }

        const displayCursor = cursor.limit(plansPerPage).skip(plansPerPage * page);
        
        try {
            const planList = await displayCursor.toArray();
            const totalNumPlans = await sample.countDocuments(query);
            return { planList, totalNumPlans };
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents ${e}`
            )
            return {planList: [], totalNumPlans: 0}
        }
    }

    static async addPlan(plan) {
        try {
            return await sample.insertOne(plan)
        } catch (e) {
            console.error(`Error inserting the plan ${e}`);
            return {error: e}
        }
    }

    static async voting(vote) {
        let oid = new ObjectId(vote.id)
        try {
            return await sample.updateOne(
                { _id: oid },
                { $inc: { "votes" : vote.value } }
            );
        } catch (e) {
            console.error(`Error in updating vote ${e}`);
            return e;
        }
    }
}

module.exports = sampleDAO