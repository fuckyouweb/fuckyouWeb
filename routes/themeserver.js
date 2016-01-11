"use strict";
var express = require('express');
var router = express.Router();
var Work = require('../db/work');

router.get('/', function(req, res) {
  var works = Work.getWorksList(function(err,works){     
    if(err) console.error(err);
    else{
      res.json(works);
    }
  });      
});

router.post('/',function(req,res){
  var searchcontent = req.body.searchcontent;
  if(searchcontent == ''){
    Work.getWorksList(function(err,works){     
      if(err) console.error(err);
      else res.json(works);
    });
  }else{
    Work.getWorks(searchcontent,function(err,works){
      if(err) console.error(err);
      else res.json(works);
    });
  }
});

module.exports = router;