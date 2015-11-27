var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest:path.join(__dirname, 'public/authorphoto')});
var cookie= require('cookie-parser');
var session = require('express-session');

var mail = require('./public/js/mail/mail');
//var myloadtest = require('./public/js/qa/myloadtest');
var credential = require('./public/js/credential/credential');

var app = express();

var LOGIN_FILE = path.join(__dirname, 'login.json');
var INDEX_FILE = path.join(__dirname, 'index.json');
var PHOTO_PATH = path.join(__dirname,'public/authorphoto');
//var PHOTO_NEWPATH = path.join(__dirname,'/public/diskphoto');

app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());

var mongoconnect = credential().mongo.development.connectionString;
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
  var isnew = false;
  var login = {};
  var newlogin = req.body;
  login.name = newlogin.name;
  login.email = newlogin.email;
  login.psw = newlogin.psw;
  login.aliveTime = new Date();
  // req.session.username = login.name;
  // req.session.useremail = login.email;
   
  console.log('login.psw='+login.psw);

  var checkuser = newlogin.email;

  // User.find({email:checkuser},function(err,users){
  //   if(err) return console.error(err);
  //   else{
  //     console.log('this person is already exist!');
  //     isnew = false;
  //   }
  // })
  /*save to db*/
  var newuser = new User(login);
 
  newuser.save(function(err,newuserEntity){
    if(err){
      console.error(err);
    }
    else{
        console.log('success save!'+newuserEntity);
        req.session.username = newuserEntity.name;
        req.session.useremail = newuserEntity.email;
        console.dir(req.session);       
    }
  });

  //mail().send(checkuser);
  
  res.status('200');
  res.json(login); 
});

function Mywork(name,theme,photo,hotrate){
  this.name = name;
  this.theme = theme;
  this.photo = photo;
  this.hotrate = hotrate;
}

/*server for index*/
app.get('/api/index', function(req, res) {
  workOptions = {
    themes:['抽象派','黑白派','印象派']
  }
  var themes = workOptions.themes;
  var arr = new Array(3);
  var indexjson = {'data1':[arr],'data2':[arr],'data3':[arr]};
  var cnt = 0;
  console.dir(req.session)
  themes.forEach(function(theme,number){
    var works = Work.getWorks(theme,function(err,works){
      //console.log('works='+works);
      if(err) console.error(err);
      else{
        works.forEach(function(value,index){
          var nowdata = 'data'+(number+1);
          //console.log('nowdata='+nowdata);
          indexjson[nowdata][index] = new Mywork(value.name,value.theme,'authorphoto/'+value.photo,value.hotrate);
        });
      }//else
      cnt++;
      //console.log('cnt='+cnt); 
      if(cnt == 3){
      //console.log('indexjson='+indexjson);
      res.status(200);
      res.json(indexjson); 
    }    
    });      
  });//themes.forEach
});

/*server for judge the user login state*/
app.get('/api/indexuser',function(req,res){
  console.log(90);
  console.log('req.session.useremail='+req.session.useremail);
  //console.dir(cookie);
 // console.dir(req.Cookie);
  console.dir(req.session);
  if(req.session.useremail == undefined){
    res.status(200);
    res.send({
      'code':0
    })
  }else{
    res.status(200);
    res.send({
      'code':1
    })
  }
});


/*server for theme*/
app.get('/api/theme', function(req, res) {
  var works = Work.getWorksList(function(err,works){      
    if(err) console.error(err);
    else{
      console.log('works='+works);
      res.json(works);
    }//else
  });      
});

/*server for register*/
app.post('/api/register',function(req,res){
  //console.log('register');
  //console.log(req.body);
  var usernow = req.body;
  User.checkUser(usernow,function(err,user){
    
    
    console.log('user='+user);
    if(err) console.error(err);
    else{
      var username = user[0].name;
      var useremail = user[0].email;
      if(user.length == 0){//not match email and psd
        res.status(200);
        res.send({
          'code':0
        });
      }else{
        //console.dir(user);
        req.session.username = username;
        req.session.useremail = useremail;
        res.status(200);
        res.send({
          'code':1
        })
      }
    }
  });
})


/*server for comeon*/
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

var comeonfile = upload.fields([
  {name:'theme', maxCount: 1000},
  {name:'describe',maxCount:1000},
  {name:'photo',maxCount:10000}]);

app.post('/api/comeon',comeonfile,function(req,res){
  console.log(3);
  console.dir(req.files);
  //console.dir('req='+req);
  // var file = req.files;
  
  var filename = req.files["photo"][0]["filename"];
  var mimetype = req.files["photo"][0]["mimetype"];
  var imgtype = mimetype.toLowerCase().substring(6);
  var theme = req.body.theme;
  var describe = req.body.describe;
  var date = new Date();
  date = date.Format('yyyyMMddhhmmss');

  //change type for system
  if(imgtype == 'jpeg') imgtype = 'jpg';

  /*save to db*/
  var savename = theme+date;
  var newwork = new Work({
    'theme':theme,
    'describe':describe,
    'photo':savename + '.'+ imgtype,
    'hotrate':0
  });
  newwork.save(function(err,newwork){
    if(err){
      console.error(err);
    }else{
      console.log('success work!'+newwork);

      res.status('200');
      res.send({
        'code' :'1',
        'newwork':newwork
      });    
    }
  });//newwork.save   
  
  /*rename img in authorphoto*/
  var authorimg = PHOTO_PATH+'/'+theme+date+'.'+imgtype;
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
  console.log('req.session.email='+req.session.email)
  if(req.session.email == undefined){
    console.log('email undefined!');
    res.status('200');
    res.send({
      'code':0
    })
  }
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
