var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest:path.join(__dirname, '/public/authorphoto')});

var mail = require('./public/js/mail/mail');
//var myloadtest = require('./public/js/qa/myloadtest');

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
});

//set sign cookie
//app.use(require('cookie-parser')(credentials.cookieSecret));
var credential = require('./public/js/credential/credential');
var mongoconnect = credential().mongo.development.connectionString;
var mongoopts = {
  server:{
    socketOptions:{keepAlive:1}
  }
};
var mongoose = require('mongoose');
mongoose.connect(mongoconnect,mongoopts);

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


switch(app.get('env')){
  case 'development':
    app.use(require('morgan')('dev'));
    break;
  case 'production':
    app.use(require('express-logger')({
      path:__dirname + '/log/requests.log'
    }));
    break;
}

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
    });

    //mail().send(checkuser);

    fs.writeFile(LOGIN_FILE, JSON.stringify(login, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(login);
      //res.redirect(303,'index.html');
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


app.get('/logoshow',function(req,res){
  fs.readFile('public/img/penmanbox.png','binary',function(error,file){
  if(error){
    res.writeHead(500,{'Content-Type':'text/plain'});
    res.write(error+'\n');
    res.end();
  }else{
    res.writeHead(200,{'Content-Type':'image/png'});
    res.write(file,'binary');
    res.end();
  }
});
})



//500
app.use(function(err,req,res,next){
  var body = '<html style="background-color:#15adbc">'+
'<head>'+
  '<meta charset="UTF-8">'+
'</head>'+
'<body>'+
  '<div style="width:40%;margin-left:30%;">'+
    '<img src="/logoshow" style="width:100%;">'+
  '</div>'+
  '<h1 style="text-align:center;color:#f8ecd4;">Error 500</h1>'+
  '<h2 style="text-align:center;color:#f8ecd4;">Ginny try to save the web! Discourage her!</h2>'+
'</body>'+
'</html>';
  res.writeHead(200,{'Content-Type':'text/html'});
  res.write(body);
  res.end();
});

//404
app.use(function(req,res){
  var body = '<html style="background-color:#15adbc">'+
'<head>'+
  '<meta charset="UTF-8">'+
'</head>'+
'<body>'+
  '<div style="width:40%;margin-left:30%;">'+
    '<img src="/logoshow" style="width:100%;">'+
  '</div>'+
  '<h1 style="text-align:center;color:#f8ecd4;">Error 404</h1>'+
  '<h2 style="text-align:center;color:#f8ecd4;">Page is not here now!</h2>'+
'</body>'+
'</html>';
  res.writeHead(200,{'Content-Type':'text/html'});
  res.write(body);
  res.end();
});



app.listen(app.get('port'), function() {
  console.log('Express started in:'+app.get('env')+' Server started: http://localhost:' + app.get('port') + '/');
});
