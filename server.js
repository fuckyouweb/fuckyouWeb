var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest:path.join(__dirname, '/public/authorphoto')});


var app = express();

var LOGIN_FILE = path.join(__dirname, 'login.json');
var COMEON_FILE = path.join(__dirname, 'comeon.json');//authorphoto/test.jpg

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/login', function(req, res) {
  fs.readFile(LOGIN_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/login', function(req, res) {
  fs.readFile(LOGIN_FILE, function(err, data) {
    var login = JSON.parse(data);
    //login.push(req.body);
    var newlogin = req.body;
    login.name = newlogin.name;
    login.email = newlogin.email;
    login.psw = newlogin.psw;
    fs.writeFile(LOGIN_FILE, JSON.stringify(login, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(login);
    });
  });
});

var comeonfile = upload.fields([
  {name:'theme', maxCount: 1000},
  {name:'describe',maxCount:1000},
  {name:'photo',maxCount:10000}]);
app.post('/api/comeon',comeonfile,function(req,res,next){
  console.log(3);
  console.dir(req.files);
  console.dir(req);
  // var file = req.files;
  // var date = new Date();
  // console.log(req.files["file"][0]["filename"]);
  // fs.renameSync(req.files["file"][0]["filename"],'test.jpg');
  // res.writeHead(200,{'Content-Type':'text/html'});
  // res.write('receive image:<br/>');
  // res.write('<img src="/show"/>');
  // res.end();
  
});

app.get('/api/comeon', function(req, res) {
  console.log(2);
  fs.readFile(COMEON_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    //res.json(JSON.parse(data));
  });
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
