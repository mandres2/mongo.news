var express = require("express");
var router = express.Router();
var db = require("../models");

router.get("/articles/saved", function (req, res) {

  db.Article.find({
      saved: true
    })
    .then(function (article) {
      res.render("savedArticles", {
        articles: article
      });
    })
    .catch(function (err) {
      res.writeContinue(err);
    });
});

module.exports = router;