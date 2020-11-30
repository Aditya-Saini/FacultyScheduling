var mongoose=require("mongoose"),
	passportLocalMongoose=require("passport-local-mongoose");

userSchema=new mongoose.Schema({
	username:String,
	password:String,
	email:String,
	phone:Number
});
userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User", userSchema);