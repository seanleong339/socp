const commentDao = require('../dao/commentDAO');

class commentController {
  static async apiGetComments(req, res) {
    var filters = req.query.planid;
    var page = req.query.page ? parseInt(req.query.page, 10) : 0;

    const commentList = await commentDao.getComment({
      filters,
      page
    });

    let response = {
      comments: commentList,
      page: page,
      filters: filters,
    };

    res.json(response);
  }

  static async apiPostComment(req, res) {
    const result = commentDao.addComment(req.body);
    res.send(result.acknowledged);
  }

  static async apiRemoveComment(req, res) {
  }
}

module.exports = commentController;