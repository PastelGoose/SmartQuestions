var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var router = require('./lib/router');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/../client/student/src/public'));
app.use(express.static(__dirname + '/../client/teacher/src/public'));
app.use('/api', router);
app.set('port', process.env.PORT || 4568);
app.listen(app.get('port'));
