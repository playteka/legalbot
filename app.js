var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var request    = require('request');
var bluemix    = require('./config/bluemix');
var extend     = require('util')._extend;

var routes = require('./routes/index');
var users = require('./routes/users');
var question = require('./routes/question.js');
var botxml = require('./routes/botxml.js');

//connect mongodb
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://botuser:botpass@localhost:27017/bot', function(err) {
                          if(err) {
                          console.log('mongodb connection error', err);
                          } else {
                          console.log('mongodb bot connection successful');
                          }
                          });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// HTTP proxy to the API
// the proxy has to be set before any other app.use, because the bodyParser destroy the proxy pipe
app.use('/proxy', function(req, res) {
  var newUrl = credentials.url + req.url;
  req.pipe(request({
				   url: newUrl,
				   auth: {
				   user: credentials.username,
				   pass: credentials.password,
				   sendImmediately: true
				   }
				   }, function(error){
				   if (error)
				   res.status(500).json({code: 500, error: errorMessage});
				   })).pipe(res);
		});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


require('./config/express')(app);


// if bluemix credentials exists, then override local
var credentials =  extend({
						  "url": 'https://gateway.watsonplatform.net/dialog/api',
						  "password": "uYvaIckTNTk1",
						  "username": "089a552d-71f7-42dd-8265-d09587731662"
						  }, bluemix.getServiceCreds('dialog')); // VCAP_SERVICES

if (credentials.url.indexOf('/api') > 0)
	credentials.url = credentials.url.substring(0, credentials.url.indexOf('/api'));


app.use('/', routes);
app.use('/users', users);

//routes
app.use('/question', question);
app.use('/botxml', botxml);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
