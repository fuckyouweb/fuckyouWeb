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

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//url+  ?test=1  start to test
app.use(function(req,res,next){
  res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
  next();
})

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/penmanbox');

var User = require('./db/user');
var db = mongoose.connection;
db.on('error', function(){
    console.log('db open error');
    console.dir(arguments);
});
db.once('open', function () {
    console.log('db open success');
    console.dir(arguments);
});

app.get('/api/login', function(req, res) {
  fs.readFile(LOGIN_FILE, function(err, data) {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/login', function(req, res) {
  fs.readFile(LOGIN_FILE, function(err, data) {
    var isnew = false;
    var login = JSON.parse(data);
    var newlogin = req.body;
    login.name = newlogin.name;
    login.email = newlogin.email;
    login.psw = newlogin.psw;

    var checkuser = newlogin.email;

    // User.find({email:checkuser},function(err,users){
    //   if(err) return console.error(err);
    //   else{
    //     console.log('this person is already exist!');
    //     isnew = false;
    //   }
    // })
    var newuser = new User(req.body);
    newuser.aliveTime = new Date();
    newuser.save(function(err,newuser){
      if(err) return console.error(err);
      else{
        if(newuser.hasOwnProperty()){
          console.log(newuser.name+'this person is already exist!');
        }else{
          console.log('success save!'+newuser);
        }        
      }
    })

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

//404
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

//500
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
