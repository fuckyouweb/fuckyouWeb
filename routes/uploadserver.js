"use strict";
var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({dest:path.join(__dirname, '../public/authorphoto')});
var PHOTO_PATH = path.join(__dirname,'../public/authorphoto');
var Work = require('../db/work');

var comeonfile = upload.fields([
  {name:'theme', maxCount: 1000},
  {name:'describe',maxCount:1000},
  {name:'photo',maxCount:10000}]);

router.post('/',comeonfile,function(req,res){
  var filename = req.files["photo"][0]["filename"];
  var mimetype = req.files["photo"][0]["mimetype"];
  var imgtype = mimetype.toLowerCase().substring(6);
  var theme = req.body.theme;
  var describe = req.body.describe;
  var date = new Date();
  var userid = req.session.userid || '';
  var username = req.session.username || '';
  date = date.Format('yyyyMMddhhmmss');
  console.log('date====='+date);

  //change type for system
  if(imgtype == 'jpeg') imgtype = 'jpg';

  /*save to db*/
  var savename = theme+date;
  var newwork = new Work({
    'theme':theme,
    'describe':describe,
    'photo':savename + '.'+ imgtype,
    'hotrate':0,
    'userid':userid,
    'username':username
  });
  newwork.save(function(err,newwork){
    console.log('dbsave');
    if(err){
      console.error(err);
    }else{
      res.status(200);
      res.send({
        'code' :'1',
        'newwork':newwork
      });    
    }
  }); 
  
  /*rename img in authorphoto*/
  var authorimg = PHOTO_PATH+'/'+theme+date+'.'+imgtype;
  fs.rename(PHOTO_PATH+'/'+filename,authorimg,function(err){
    if(err){
       console.error(err);  
    }else{
       console.log('renamed complete');
     }
  });
});

module.exports = router;