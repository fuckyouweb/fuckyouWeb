var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var COMMENTS_FILE = path.join(__dirname, 'login.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/login', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/login', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    var login = JSON.parse(data);
    login.push(req.body);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(login, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(login);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
