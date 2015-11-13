var mongoose = require('mongoose');

/*
workSchema	theme,describe,link
 */
var workSchema = new mongoose.Schema({
	theme:String,
	describe:String,
	link:String  // workall文件中对应位置
},{
	minimize:false
});

var UserModel = mongoose.model('Work',workSchema);
module.exports = WorkModel;