"use strict";
var express = require('express');
var router = express.Router();
var Work = require('../db/work');

router.get('/', function(req, res) {
  var works = Work.getWorksList(function(err,works){ 
    console.log(222);
    console.log('works='+works);     
    if(err) console.error(err);
    else{
      res.json(works);
    }//else
  });      
});

router.post('/',function(req,res){
  var searchcontent = req.body.searchcontent;
  Work.getWorks(searchcontent,function(err,works){
    if(err) console.error(err);
    else{
      res.json(works);
    }
  })
});

module.exports = router;