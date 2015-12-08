"use strict";
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.get('/', function(req, res) {
  if(req.session.useremail == undefined || req.session.useremail == ''){
    res.status('200');
    res.send({
      'code':0
    }).end();
  }else{
    res.status('200');
    res.send({
      'code':2
    })
  }
});

module.exports = router;