const sampleDAO = require("../dao/sampleDAO.js")
const criteriaDAO = require("../dao/criteriaDAO")
const least = require("./counting")

class userController {
    /**
      * @param {http request} req 
      * @param {http response} res 
      * this method only works if request body is in json format
      */
    static async apiSubmitPlan(req, res) {
        let submission = req.body;
        const success = await sampleDAO.addPlan(submission);
        if (success) {
            res.send(true);
            console.log("success")
        }
    }

    static async apiCheckPlan(req, res) {
        console.log(req.query)
        let plan = req.query.y1s1.concat(req.query.y1s2, req.query.y2s1, req.query.y2s2, req.query.y3s1, req.query.y3s2, req.query.y4s1, req.query.y4s2)
        let filters = { "major": req.query.major };
        if ("specialisation" in req.query) {
            filters.specialisation = req.query.specialisation;
        }
        let crit = await criteriaDAO.getCriteria(filters);
        let answer = {};

        if (crit.core.every(x => plan.indexOf(x) > -1)) {
            answer.core = true
            console.log("all core mods present")
        }
        else {
            answer.core = false
            console.log("missing core mods")
        }


        if (crit.set1) {
            answer.set1 = least(plan, crit.set1, 2);
            answer.set2 = least(plan, crit.set2, 3);
        }

        if (parseInt(req.query.totalmc) < 160) {
            console.log(req.query.totalmc)
            answer.mc = false;
        }
        else {
            answer.mc = true;
        }
        console.log(answer);
        res.send(answer);
    }

    static async apiGetModules(req, res) {
        let filters = { "major": req.query.major };
        if ("specialisation" in req.query) {
            filters.specialisation = req.query.specialisation;
        }
        let crit = await criteriaDAO.getCriteria(filters);
        console.log('crit',crit);
        res.json(crit);
    }
}

module.exports = userController
