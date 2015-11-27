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
	console.log(22222);
	console.log('value.email='+value.email+'  value.psw='+value.psw);
    return this.find({"email":value.email,"psw":value.psw}).exec(cb);
});

userSchema.static('getUser', function (cb) {
	//console.log('value='+value);
    return this.find().exec(cb);
});

userSchema.static('getUserByEmail',function(value,cb){
	return this.find({"email":value}).exec(cb);
});

userSchema.static('getUserById',function(value,cb){
	return this.find({"_id":value}).exec(cb);
});
//userSchema.set('autoIndex', true);

// userSchema.static('getList',function(cb){
// 	return this.find().sort({releaseTime:-1}).exec(cb);
// });

// userSchema.static('delUser',function(userId,cb){
// 	return this.findByIdAndRemove(userId).exec(cb);
// });

// userSchema.static('getUser',function(userId,cb){
// 	return this.findById(userId,function(err,userEntity){
// 		if(userEntity){

// 		}
// 	})
// });

// userSchema.static('updateUser',function(newUser,cb){

// });

var UserModel = mongoose.model('User',userSchema);
module.exports = UserModel;