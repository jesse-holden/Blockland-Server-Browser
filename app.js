var express = require("express"),
  path = require("path"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser"),
  bodyParser = require("body-parser"),
  hbs = require("hbs");

require("dotenv").config();

var mongoose = require("mongoose");
// Change to your MongoDB server address
var mongodb_SERVER = process.env.DB_SERVER;
// Change to MongoDB table name
var mongodb_TABLE = process.env.DB_TABLE;
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Routing
var index = require("./routes/index"),
  serverlist = require("./routes/serverlist"),
  api = require("./routes/api");

// Import models
var Server = require("./models/Server.js");
var Library = require("./models/Library.js");

var app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerPartials(__dirname + "/views/partials");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", index);
app.use("/serverlist", serverlist);
app.use("/api", api);

// Database configuration with mongoose
mongoose.connect(
  "mongodb://" + mongodb_SERVER + "/" + mongodb_TABLE,
  {
    useMongoClient: true
  }
);

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

var serverLibrary = new Library({
  name: "Blockland Server Library"
});

serverLibrary.save(function(error, doc) {
  if (error) {
    console.log("Blockland Server Library already exists in database.");
  } else {
    console.log("Blockland Library Found.");
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
