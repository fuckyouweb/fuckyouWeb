var mongoose = require('mongoose');

/*
workSchema	theme,describe,link
 */
var workSchema = new mongoose.Schema({
	theme:String,
	describe:String,
	head:String,
	photo:String,  // theme+date
	hotrate:Number,
	userid:String,
	username:String
},{
	minimize:false
});

workSchema.static('getWorks', function (WorkTheme, cb) {
    return this.find({"theme":WorkTheme}).exec(cb);
});

workSchema.static('getWorksList',function(cb){
	return this.find().exec(cb);
});

workSchema.static('getWorksByUserId', function (userid, cb) {
    return this.find({"userid":userid}).exec(cb);
});

workSchema.static('deleteWorkById',function(workid,cb){
	return this.findByIdAndRemove(workid).exec(cb);	
});


workSchema.static('updateWork', function (workid,theme,describe, cb) {
    return this.update({
        '_id': workid
    }, {'theme': theme,'describe': describe}).exec(cb);
});

var WorkModel = mongoose.model('Work',workSchema);
module.exports = WorkModel;