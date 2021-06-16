
let criteria;

class criteriaDAO {
    static async injectdb(conn) {
        if (criteria) {
            return;
        }
        try {
            criteria = await conn.db("socplanner").collection("coursecriteria");
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in criteriaDAO ${e}`
            )
        }
    }

    static async getCriteria(filters) {
        let query;
        if ("specialisation" in filters) {
            query = { "specialisation": { $eq: filters["specialisation"] } }
        }
        else {
            query = { "major": { $eq: filters["major"] } }
        }

        let doc
        try {
            doc = await criteria.findOne(query);
            return doc;
        } catch (e) {
            console.error(`Error in querying criteria collection ${e}`);
        }
    }

 
}

module.exports = criteriaDAO;