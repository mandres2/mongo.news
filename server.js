// Dependencies
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var articleRoutes = require("./routes/article");
var indexRoutes = require("./routes/index");
var savedArticles = require("./routes/savedArticles");
var path = require("path");

// Turn on Debugging so one can see what is being sent to MongoDB
mongoose.set("debug", true);

// 'morgan' is used for automated logging of requests, responses and related data. When added as a middleware to an express/connect app, by default it should log statements to stdout showing details of the following: remote ip, request method, http version, response status.

var PORT = process.env.PORT || 4000;

// Initialize Express
var app = express();

// Middleware configurations:

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse the request body as a JSON object
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Create a public static folder
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, "/public")));

// Set handlebars as the default template engine:
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Connect to the MongoDB - uncomment this once .env is setup and working
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// mongoose.connect(MONGODB_URI);
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Connect to local mongodb
mongoose.connect("mongodb://localhost/mongoHeadlines", {
  useNewUrlParser: true
});

// Defining which routes to use
app.use("/", indexRoutes);
app.use("/articles", articleRoutes);

// FIXME: It's not hitting the id. This is possibly why Notes are not appending onto the saved articles page.
// app.use("/articles/articles/:id", articleRoutes);
app.use("/articles/saved", savedArticles);


// Server Start
app.listen(PORT, function () {
  console.log("App running on port " + PORT);
});