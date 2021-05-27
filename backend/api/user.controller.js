const sampleDAO = require("../dao/sampleDAO.js")

class userController {
    /**
      * 
      * @param {http request} req 
      * @param {http response} res 
      * this method only works if request body is in json format
      */
    static async apiSubmitPlan(req, res, next) {
        let submission = req.body;
        const success = await sampleDAO.addPlan(submission);
        if (success) {
            res.send(true);
        }
    }
}
    
module.exports = userController