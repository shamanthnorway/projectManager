var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var passport = require('passport');

var index = require('./routes/index');
var teams = require('./routes/teams');
var tasks = require('./routes/tasks');
var wikis = require('./routes/wikis');
var users = require('./routes/users');
var login = require('./routes/login');
var tickets = require('./routes/tickets');

var app = express();
// var port = 8080;
// var hostname = 'localhost';
app.set('port', process.env.PORT || 3001);
console.log(`App is listen at http://localhost:3001/`);

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 
 //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
 });

var mongoose = require('mongoose'),
assert = require('assert');
var url = 'mongodb://localhost:27017/projectManager';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
// we're connected!
console.log("Connected correctly to server");
});
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
  name: 'ThisIsMySession',
  keys: ['thisisafirstkey', 'thisisasecondkey']
}));
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/', login);
app.use('/teams', teams);
app.use('/users', users);
app.use('/tasks', tasks);
app.use('/tickets', tickets);
app.use('/wikis', wikis);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(app.get('port'));
module.exports = app;
