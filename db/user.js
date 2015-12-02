var mongoose = require('mongoose');

/*
userSchema  name,email,psd,workid,aliveTime
 */
var userSchema = new mongoose.Schema({
	name:String,
	email:{
		type:String,
		index: {unique: true}
	},
	psw:String,
	aliveTime:Date,//每次登陆时更新
},{
	minimize:false
});

userSchema.static('checkUser', function ( value,cb) {
    return this.find({"email":value.email,"psw":value.psw}).exec(cb);
});

userSchema.static('getUser', function (cb) {
    return this.find().exec(cb);
});

userSchema.static('getUserByEmail',function(value,cb){
	return this.find({"email":value}).exec(cb);
});

userSchema.static('getUserById',function(value,cb){
	return this.find({"_id":value}).exec(cb);
});

var UserModel = mongoose.model('User',userSchema);
module.exports = UserModel;