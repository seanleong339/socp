const sampleDAO = require("../dao/sampleDAO.js")

class sampleController {
    static async apiGetSamples(req, res, next) {
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;
        
        let filters = {};
        if (req.query.major) {
            filters.major = req.query.major;
        }
        if (req.query.specialisation) {
            filters.specialisation = req.query.specialisation;
        }

        const { planList, totalNumPlans } = await sampleDAO.getPlan({
            filters,
            page,
        });

        let response = {
            plans: planList,
            page: page,
            filters: filters,
            totalresults: totalNumPlans,
        }
        console.log(response)
        res.json(response)
    }

    static async apiUpdateVote(req, res) {
        let vote = {};
      console.log(req)
        vote.id = req.body.id;
        vote.value = req.body.value;
        if (await sampleDAO.voting(vote)) {
            console.log("vote updated successfully")
            res.send(true);
        }
        else {
            res.send(false)
        }
    }
    
   
}

module.exports = sampleController;
