const sampleDAO = require("../dao/sampleDAO.js")
const criteriaDAO = require("../dao/criteriaDAO")
const counting = require("./counting")

class userController {

    static async apiCheckPlan(req, res) {
        let plan = req.query.y1s1.concat(req.query.y1s2, req.query.y2s1, req.query.y2s2, req.query.y3s1, req.query.y3s2, req.query.y4s1, req.query.y4s2)
        let filters = { "major": req.query.major };
        if ("specialisation" in req.query) {
            filters.specialisation = req.query.specialisation;
        }
        let crit = await criteriaDAO.getCriteria(filters);
        if (crit == null) {
            res.send("No criteria found for this major");
            return;
        }

        let answer = { "core": {} };

        answer.core = counting.least(plan, crit.core, crit.core.length);
        answer.core.mod = crit.core.filter(x => {
            return !(answer.core.mod.indexOf(x) > -1);
        });
        answer.pass = answer.core.pass;
        
        if (filters.major == 'computer science') {
            answer.focus = counting.elective(req.query.major, crit, plan);
            answer.pass = answer.elective.pass;
        }
        else {
            answer.elective = counting.elective(req.query.major, crit, plan);
            answer.pass = answer.elective.pass;
        }

        if (crit.set1) {
            answer.set1 = counting.least(plan, crit.set1, 2);
            answer.set2 = counting.least(plan, crit.set2, 3);
            if (!answer.set1.pass || !answer.set2.pass) {
                answer.pass = false;
            }
        }

        if (parseInt(req.query.totalmc) >= 160) {
            answer.mc = true;
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
        console.log(req)
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
