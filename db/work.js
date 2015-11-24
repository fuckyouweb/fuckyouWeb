var mongoose = require('mongoose');

/*
workSchema	theme,describe,link
 */
var workSchema = new mongoose.Schema({
	theme:String,
	describe:String,
	head:String,
	photo:String,  // theme+date
	hotrate:Number
},{
	minimize:false
});

var WorkModel = mongoose.model('Work',workSchema);
module.exports = WorkModel;