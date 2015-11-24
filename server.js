var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest:path.join(__dirname, '/authorphoto')});

var mail = require('./public/js/mail/mail');
//var myloadtest = require('./public/js/qa/myloadtest');

var app = express();

var LOGIN_FILE = path.join(__dirname, 'login.json');
var INDEX_FILE = path.join(__dirname, 'index.json');
var PHOTO_PATH = path.join(__dirname,'/authorphoto');
var PHOTO_NEWPATH = path.join(__dirname,'/diskphoto');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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
var Work = require('./db/work');
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

/*server for login*/
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
    /*save to db*/
    var newuser = new User(req.body);
    newuser.aliveTime = new Date();
    newuser.save(function(err,newuser){
      if(err){
        console.error(err);
      }
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

/*server for index*/
app.get('/api/index', function(req, res) {
  fs.readFile(INDEX_FILE, function(err, data) {
    console.log('data='+data);
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

/*server for comeon*/
Date.prototype.Format = function(fmt)   
{ //author: meizz   
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

var comeonfile = upload.fields([
  {name:'theme', maxCount: 1000},
  {name:'describe',maxCount:1000},
  {name:'photo',maxCount:10000}]);
app.post('/api/comeon',comeonfile,function(req,res,next){
  // res.setHeader(200,{'Content-Type':'text/html'});
  // res.sendStatus(200);
  // res.send(2222);
  // res.end();
  console.log(3);
  console.dir(req.files);
  //console.dir('req='+req);
  // var file = req.files;
  
  var filename = req.files["photo"][0]["filename"];
  var mimetype = req.files["photo"][0]["mimetype"];
  var imgtype = mimetype.substring(6);
  var theme = req.body.theme;
  var describe = req.body.describe;
  var date = new Date();
  date = date.Format('yyyyMMddhhmmss');

  /*save to db*/
  var savename = theme+date;
  var newwork = new Work({
    'theme':theme,
    'describe':describe,
    'photo':savename,
    'hotrate':0
  });
  newwork.save(function(err,newwork){
    if(err){
      console.error(err);
    }else{
      console.log('success work!'+newwork);       
    }
  });//newwork.save   
  
  fs.readFile(PHOTO_PATH+'/'+filename,'binary',function(err,data){
    console.log('start to read');
    if(err){
      console.error(err);
    }else{
      fs.readdir(PHOTO_NEWPATH, function(err,dircontent){//read the dir
        if(err){
          console.error(err);
        }else{
          var direxist = 0
          dircontent.map(function(value){//search for dir array
            var direxist = 0;
            if(value == theme)
              direxist += 1;
              return direxist;
          });
          var PHOTO_NEWPATH_THEME = PHOTO_NEWPATH+'/'+theme;
          console.log(direxist);
          if(!direxist){//the file is not exist
            console.log(5);
            fs.mkdir(PHOTO_NEWPATH_THEME,function(err){
              if(err){
                console.error(err);
              }else{
                console.log('mkdir success');
                var PHOTO_NEWPATH_NAME = PHOTO_NEWPATH_THEME+'/'+theme+date+'.'+imgtype;
                fs.writeFile(PHOTO_NEWPATH_NAME,data,function(err){
                  if(err){
                    console.error(err);
                  }else{
                    console.log("File Saved !"); //文件被保存
                  }
                });
              }
            });//mkdir
          }else{//direxist
            console.log(6);
            var PHOTO_NEWPATH_NAME = PHOTO_NEWPATH_THEME+'/'+theme+date+'.'+imgtype;
            fs.writeFile(PHOTO_NEWPATH_NAME,data,function(err){
              if(err){
                console.error(err);
              }else{
                console.log("File Saved !"); //文件被保存
              }
            });
          }//direxist         
        }//fs.readdir
      });
    }
  });
  next();
});

/*server for comeon*/
app.post('/api/comeon',function(req,res){
  /*rename img in authorphoto*/
  var authorimg = PHOTO_NEWPATH_THEME+'/'+theme+date+'.'+imgtype;
  fs.rename(PHOTO_PATH+'/'+filename,authorimg,function(err){
    console.log(7);
    if(err){
       console.log(err);  
    }else{
       console.log('renamed complete');
     }
  });
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
