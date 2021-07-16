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
    console.log('RESPONSE', response)
    res.json(response);
  }

  static async apiPostComment(req, res) {
    console.log("POST")
    const result = commentDao.addComment(req.body);
    res.send(await result);
  }

  static async apiRemoveComment(req, res) {
    const user = req.user;
    const result = commentDao.deleteComment(req.body.id, user.email);
    res.send(result);
  }
}

module.exports = commentController;