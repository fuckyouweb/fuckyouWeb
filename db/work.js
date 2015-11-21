var mongoose = require('mongoose');

/*
workSchema	theme,describe,link
 */
var workSchema = new mongoose.Schema({
	theme:String,
	describe:String,
	photo:String  // workall文件中对应位置
},{
	minimize:false
});

var WorkModel = mongoose.model('Work',workSchema);
module.exports = WorkModel;