"use strict";
var express = require('express');
var router = express.Router();
var Admin = require('../db/admin');
var User = require('../db/user');

router.get('/',function(req,res){
  console.log('adminmanager');
  res.render('adminmanager');
});

module.exports = router;