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
	userid:String,//userid
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

// workSchema.static('linkProject', function (fileId, projectEntity) {
//     return this.findOneAndUpdate({
//         _id: fileId
//     }, {project: projectEntity}, {'new': true}).exec(function () {
//     });
// });

// workSchema.static('getListByProject', function (projectId, cb) {
//     return this.find({project: projectId,state:1}).exec(cb);
// });

// workSchema.static('updateWork', function (WorkId, cb) {
//     return this.findOneAndUpdate({
//         _id: WorkId
//     }, {state: 2}, {'new': true}).exec(cb);

// });

var WorkModel = mongoose.model('Work',workSchema);
module.exports = WorkModel;