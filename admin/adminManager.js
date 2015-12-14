"use strict";
var express = require('express');
var router = express.Router();
var Admin = require('../db/admin');
var User = require('../db/user');

router.get('/',function(req,res){
  console.log('render admin');
  res.render('login');
});

router.post('/login',function(req,res){
  console.log('4545');
  console.dir(req.body);
  // var newadmin = new Admin(req.body);       
  //       newadmin.save(function(err,newadminEntity){
  //         if(err) console.error(err);
  //         else{            
  //             console.log('success save!'+newadminEntity);  
  //             res.redirect('/')
  //         }
  //       });  
});

module.exports = router;