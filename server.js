var fallback = require('express-history-api-fallback')
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var mkdirp = require('mkdirp');
var cors = require('cors')

global.config = require('./config');
var jwt = require('jsonwebtoken');
//var localIp = process.env.IP != undefined ? process.env.IP : "localhost";
//var localport = process.env.PORT != undefined ? process.env.PORT : 4500;


var localport = process.env.PORT || 4500;

var localIp = process.env.IP || "localhost";
console.log(localIp);
console.log(localport);


var storage = multer.diskStorage({
  destination: function (req, file, cb) {

    var dest = 'public/uploads/';
    mkdirp(dest, function (err) {
      if (err) cb(err, dest);
      else cb(null, dest);
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

global.multerUpload = multer({ storage: storage });


mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect("mongodb://thilaktest:test123@ds143070.mlab.com:43070/tech_registry_db", {
  useUnifiedTopology: true,
  useNewUrlParser: true
}, function (err, db) {
  if (err) {
    return console.dir(err);
  }
});



var apiRouteOpen = require('./routes/apiRoutesOpen');
var apiRouteSecured = require('./routes/apiRoutesSecured');
var middleWare = require('./middleware/JSWMiddleware');

var app = express();


app.use(cors())
// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', apiRouteOpen);
app.use('/apiS', middleWare, apiRouteSecured);

app.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  res.status(err.status).send(err)
});
app.listen(localport);


console.log('Server running at ' + localIp + ':' + localport);
module.exports = app;