// server.js
const version = '1.0'

// set up ======================================================================
// get all the tools we need
require("dotenv").config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' })); // get information from html forms
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
const port = process.env.PORT;
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const configDB = require('./config/database.js');
const multer = require('multer');
const AccessToken = require('twilio/lib/jwt/AccessToken.js');
const ObjectID = require('mongodb').ObjectID

let db

// configuration ===============================================================
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
  secret: 'rcbootcamp2021b', // session secret
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// launch ======================================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db, multer, ObjectID);
  app.listen(port);
  console.log('The magic happens on port ' + port);
}); // connect to our database
