var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest:path.join(__dirname, 'public/authorphoto')});
var cookie= require('cookie-parser');
var session = require('express-session');

var mail = require('./public/js/mail/mail');
var credential = require('./public/js/credential/credential');
var config = require('./config/index');

var app = express();
app = config(app);

var PHOTO_PATH = path.join(__dirname,'public/authorphoto');
var HEAD_PATH = path.join(__dirname,'public/head');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());

var mongoconnect = null;
switch(process.argv[2]){
  case 'dev':
    mongoconnect = credential().mongo.development.connectionString;
    app.use(require('morgan')('dev'));
    break;
  default:
    mongoconnect = credential().mongo.production.connectionString;
    app.use(require('express-logger')({
      path:__dirname + '/log/requests.log'
    }));
    break;
}

var mongoopts = {
  server:{
    socketOptions:{keepAlive:1}
  }
};
var mongoose = require('mongoose');
mongoose.connect(mongoconnect,mongoopts);

var MongoStore = require('connect-mongo')(session);
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'penmanbox',
    key: 'penmanbox',//cookie name
    store: new MongoStore({mongooseConnection: mongoose.connection}),
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 7}//7 days
}));

var User = require('./db/user');
var Work = require('./db/work');

var index = require('./routes/indexserver');
var userstate = require('./routes/userstate');
var login = require('./routes/loginserver');
var register = require('./routes/registerserver');
var theme = require('./routes/themeserver');
var home = require('./routes/homeserver');
var comeon = require('./routes/comeonserver');
var upload = require('./routes/uploadserver');
var admin = require('./admin/adminManager');

var db = mongoose.connection;
db.on('error', function(){
    console.log('db open error');
    console.dir(arguments);
});
db.once('open', function () {
    console.log('db open success');
    console.dir(arguments);
});

app.use('/',index);
app.use('/',userstate);
app.use('/',register);
app.use('/api/index',index);
app.use('/api/index',userstate);
app.use('/api/index',register);
app.use('/api/login',login);
app.use('/api/home',home);
app.use('/api/home',userstate);
app.use('/api/home',register);
app.use('/api/theme',theme);
app.use('/api/comeon',comeon);
app.use('/upload',upload);

app.use('/admin',admin);

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
});

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

Date.prototype.Format = function(fmt){
  var o = { 
    //"y+" : this.getFullYear(),  
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  console.log('fmt='+fmt);
  return fmt;   
} 

module.exports = app;
