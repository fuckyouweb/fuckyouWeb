"use strict";
var express = require('express');
var router = express.Router();
var Admin = require('../db/admin');
var User = require('../db/user');
var Worker = require('../db/work');

function AdminWork(_id,work,author,theme,describe){
  this._id = _id;
  this.work = work;
  this.author = author;
  this.theme = theme;
  this.describe = describe;
}

router.get('/',function(req,res){
  console.log('manager');
  Worker.getWorksList(function(err,works){
    if(err) console.error(err);
    else{
      console.log('works==='+works.length);
      // var adminwork = [];
      // for(var i=0 ; i<works.length ; i++){
      //   adminwork[i].
      // }
      var workjson = JSON.stringify(works);
      console.log('workjson=='+workjson);
      res.render('adminmanager',{workjson:workjson});
    }
  });
});

module.exports = router;