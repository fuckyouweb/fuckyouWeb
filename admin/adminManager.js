"use strict";
var express = require('express');
var router = express.Router();
var Admin = require('../db/admin');
var User = require('../db/user');
var Work = require('../db/work');
var fs = require('fs');
var path = require('path');

function AdminWork(_id,work,author,theme,describe){
  this._id = _id;
  this.work = work;
  this.author = author;
  this.theme = theme;
  this.describe = describe;
}

router.get('/',function(req,res){
  console.log('manager');
  Work.getWorksList(function(err,works){
    if(err) console.error(err);
    else{
      var workjson = works;
      res.render('adminmanager',{workjson:workjson});
    }
  });
});

router.post('/delwork',function(req,res){
  console.log('delwork');
  var workid = req.body.workid.replace(/\"/g, "");;
  console.log(workid);
  Work.deleteWorkById(workid,function(err,works){
    var photo = works.photo;
    if(err) console.error(err);
    else{
      console.log('success');
      res.status(200);
      res.send({
        'code':1
      });
    }
    fs.unlink(path.join(__dirname,'../public/authorphoto',photo),function(err){
      if(err) console.error(err);
    });
  });
});

module.exports = router;