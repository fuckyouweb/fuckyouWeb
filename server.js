var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var formidable = require('formidable');

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
    login.push(req.body);
    fs.writeFile(LOGIN_FILE, JSON.stringify(login, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(login);
    });
  });
});

app.post('/api/comeon',function(req,res){
  //console.log("req="+req[0]);
  // fs.readFile(COMEON_FILE,'binary',function(err,file){
  // if(err){
  //   console.log('comeon post err');
  //   res.writeHead(500,{'Content-Type':'text/plain'});
  //   res.write(err+'\n');
  //   res.end();
  // }else{
  //   console.log(1);
  //   res.writeHead(200,{'Content-Type':'image/jpg'});
  //   //res.write(file,'binary');
  //   //res.json(file);
  //   res.end();
  // }
//});
    
  
    var form = new formidable.IncomingForm();
    console.log('about to parse');
    form.uploadDir="./authorphoto";//必须设置
    form.parse(req,function(error,fields,files){
      console.log(files);
      console.log('parsing done');
      fs.renameSync(files.upload.path,'test.jpg');
    });

    fs.readFile(COMEON_FILE, function(err, data) {
    var comeon = JSON.parse(data);
    console.log("comeon="+comeon);
    var len = comeon.length;

    

//     function sleep(milliSeconds){
//   var startTime = new Date().getTime();
//   while(new Date().getTime() < startTime+milliSeconds)
//     ;
// }

// sleep(2000);
//     req.body.photo = "test.jpg";
    console.log(" req.body="+ req.body);
    comeon.push(req.body);
    fs.writeFile(COMEON_FILE, JSON.stringify(comeon, null, 4), function(err) {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(comeon);
    });
  });
})

app.post('/upload',function(req,res){
  console.dir(req);
  // var form = new formidable.IncomingForm();
  // console.log('about to parse');
  // form.parse(req,function(error,fields,files){
  //   console.log('parsing done');
  //   fs.renameSync(files.upload.path,'test.jpg');
  // })
  res.writeHead(200,{'Content-Type':'text/html'});
  res.write('receive image:<br/>');
  res.write('<img src="/show"/>');
  res.end();
});

// app.post('/show',function(req,res){
//   s.readFile('tmp/test.png','binary',function(error,file){
//   if(error){
//     response.writeHead(500,{'Content-Type':'text/plain'});
//     response.write(error+'\n');
//     response.end();
//   }else{
//     response.writeHead(200,{'Content-Type':'image/png'});
//     response.write(file,'binary');
//     response.end();
//   }
// });
// })

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
