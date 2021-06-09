const sampleDAO = require("../dao/sampleDAO.js")
const criteriaDAO = require("../dao/criteriaDAO")
const least = require("./counting")

class userController {

    static async apiCheckPlan(req, res) {
        console.log(req.query)
        let plan = req.query.y1s1.concat(req.query.y1s2, req.query.y2s1, req.query.y2s2, req.query.y3s1, req.query.y3s2, req.query.y4s1, req.query.y4s2)
        let filters = { "major": req.query.major };
        if ("specialisation" in req.query) {
            filters.specialisation = req.query.specialisation;
        }
        console.log(filters);
        let crit = await criteriaDAO.getCriteria(filters);
        if (crit == null) {
            res.send("No criteria found for this major");
            return;
        }
        let answer = {"core":{}};
        let missing = { "arr": [], "pass": true };
        for (var y = 0; y < crit.core.length; y++) {
                if (!(plan.indexOf(crit.core[y]) > -1)) {
                    missing.arr.push(crit.core[y]);
                    missing.pass = false;
            };
        };
        if (missing.pass == true) {
            answer.core.pass = true;
            answer.pass = true;
            console.log("all core mods present");
        }
        else {
            answer.core.pass = false;
            answer.core.modules = missing.arr;
        }

        if (crit.set1) {
            answer.set1 = least(plan, crit.set1, 2);
            answer.set2 = least(plan, crit.set2, 3);
            if (!(answer.set1.pass || answer.set2.pass)) {
                answer.pass = false;
            }
        }

        if (parseInt(req.query.totalmc) < 160) {
            console.log(req.query.totalmc)
            answer.mc = false;
        }
        else {
            answer.mc = false;
            answer.pass = false;
        }

        if (req.query.submit) {
            return answer;
        }
        console.log(answer);
        res.send(answer);
        return answer;
    }

    static async apiSubmitPlan(req, res) {
        var check = await userController.apiCheckPlan(req, res);
        if (check.pass) {
            let submission = req.query;
            delete submission.submit;
            console.log(submission);
            const success = await sampleDAO.addPlan(submission);
            if (success) {
                res.send(true);
            }
        }
        else {
            console.log("Plan does not pass checks");
            res.send(false);
        }
    }

    static async apiGetModules(req, res) {
        let filters = { "major": req.query.major };
        if ("specialisation" in req.query) {
            filters.specialisation = req.query.specialisation;
        };
        let crit = await criteriaDAO.getCriteria(filters);
        console.log('crit',crit);
        res.json(crit);
    }
}

module.exports = userController
