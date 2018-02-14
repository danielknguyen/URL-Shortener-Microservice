var express = require('express'),
    // run the express web-server
    app = express(),
    // used to file sensitive variables within application
    dotenv = require('dotenv').config(),
    // used to parse endpoint streamdata as JSON
    bodyParser = require('body-parser'),
    // require template engine to display static pages
    engines = require('consolidate'),
    // module to handle errors
    assert = require('assert'),
    // require/import the mongodb native drivers.
    mongodb = require('mongodb');

// serve static files, assets, css, javascript in said directory
app.use(express.static(__dirname + '/public'));
// set directory of view templates
app.set('views', __dirname + '/views');
// set engine template to nunjucks
app.engine('html', engines.nunjucks);
// convert data to be easily transferred through the web
app.use(bodyParser.urlencoded({ extended: true}));
// parse/analyze incoming data as json object
app.use(bodyParser.json());

// require routes module
var routes = require('./public/scripts/routes.js');
routes(app, mongodb);

// set heroku environment PORT || local PORT
var port = process.env.PORT || 5000;
// listen for connection at PORT
var server = app.listen(port, function(){
  // log the port connection
  console.log("Express server listening on port %s.", port);
});
