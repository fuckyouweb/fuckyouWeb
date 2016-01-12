"use strict";
var express = require('express'),
    router = express.Router(),
    Work = require('../db/work');

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