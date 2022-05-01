const cors = require("cors");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
require("dotenv").config();

//middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Connecting to the routes
app.use(require("./routes/index"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

module.exports = app;
