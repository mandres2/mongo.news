//Dependencies
var express = require("express");
var router = express.Router();
var db = require("../models");

// scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Route for getting 20 articles from the db - need to revisit this logic...we need to stop somewhere but this may not be the best way to handle this
router.get("/", function (req, res) {
  db.Article.find({}).sort({
      created: -1
    }).limit(20)
    .then(function (article) {
      res.render("index", {
        articles: article
      });
    })
    .catch(function (err) {
      res.writeContinue(err);
    });
});

// Route for displaying all 20 saved articles, along with their notes, from the db (Saved Articles link)
router.get("/articles/saved/", function (req, res) {
  db.Article.find({
      saved: true
    }).sort({
      created: -1
    }).limit(20).populate("note")
    .then(function (article) {
      // var hbsObject = { articles: article };
      // res.render("index", hbsObject);
      res.render("savedArticles", {
        articles: article
      });
    })
    .catch(function (err) {
      res.writeContinue(err);
    });
});

// ------------------------------------------ Scrape ------------------------------------------ //

// Route for scraping the NPR website (Scrape New Articles button)
router.get("/scrape", function (req, res) {
  // First, grab the body of the html with axios
  console.log(req);
  axios.get("https://www.npr.org/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    console.log($);
    console.log(response);

    // grabs every h3 within an article tag, and do the following:
    $("h3.title").each(function (i, element) {
      // Save an empty result object
      var result = {};

      //var title = $(element).parent().text();
      //var link = $(element).parent("a").attr("href");
      //var teaser = $(element).parent("a").siblings("a").children("p").text();

      // Add text and href of every link, and the teaser, and save them as properties of the result object
      result.title = $(this)
        .parent("a")
        .text();
      result.link = $(this)
        .parent("a")
        .attr("href");
      result.teaser = $(this)
        .parent("a")
        .siblings("a")
        .children("p")
        .text();

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log("This is the created dbArticle" + dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.writeContinue(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Delete route to remove a single article from index
router.delete("/deleteArticle/:id", function (req, res) {
  db.Article.remove({
      _id: req.params.id
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.writeContinue(err);
    });
});

// Clear the DB
router.get("/clear-articles", function (req, res) {
  // Remove every note from the notes collection
  db.Article.remove({}, function (error, response) {
    // Log any errors to the console
    if (error) {
      res.writeContinue(err);
    } else {
      // Otherwise, send the mongo.js response to the browser
      // This will fire off the success function of the ajax request
      console.log(response);
      res.send(response);
    }
  });
});

module.exports = router;