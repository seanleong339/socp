let sample

class sampleDAO {
    static async injectdb(conn) {
        if (sample) {
            return;
        }
        try {
            sample = await conn.db(process.env.SOCPLANNER_NS).collections("studyplan");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in SampleDAO ${e}`
            )
        }
    }

    static async getPlan({
        filters = null,
        page = 0,
        plansPerPage = 5
    } = {})
    {
        let query
         if (filters) {
            if ("major" in filters) {
                query = {"major": {$eq: filters["major"]}}
            }
            else if ("specialisation" in filters) {
                query = {"specialisation": {$eq: filters["specialisation"]}}
            }
        }

        let cursor

        try {
            //console.log(sample)
            cursor = await sample.find()//query)
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
}

module.exports = sampleDAO