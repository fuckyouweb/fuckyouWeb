var mongoose = require('mongoose');

/*
adminSchema	email,psw,auth
 */
var adminSchema = new mongoose.Schema({
	email:{
		type:String,
		index:{unique:true}
	},
	password:String,
	auth:String
},{
	minimize:false
});

adminSchema.static('checkAdmin', function ( value,cb) {
    return this.find({"email":value.email,"psw":value.psw}).exec(cb);
});

var AdminModel = mongoose.model('Admin',adminSchema);
module.exports = AdminModel;