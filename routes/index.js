var express=require("express");
var router=express.Router({mergeParams:true});
var passport=require("passport");
var moment = require('moment-timezone');
var multer = require('multer'),
	mongoose = require("mongoose"),
	ObjectId = mongoose.Types.ObjectId;
var upload = multer({dest: 'uploads/'})
const middlewareObj = require("../middleware");
const user = require("../models/user");
var User=require("../models/user"),
	Task=require("../models/task"),
	Event=require("../models/event");








router.get("/register", middlewareObj.loggedIn, function(req, res){
	res.render("register");
});

router.post("/register", middlewareObj.loggedIn, upload.single('image'), function(req, res){
	var newUser=new User({username:req.body.name, email:req.body.email, phone:req.body.phone});
	var newTask;
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log("error at new user")
			return res.render("register",{error:err.message});
		}
		console.log(user._id);
		var newEvent= new Event({_id:user.id});
		Event.create(newEvent, (err, data)=>{
			if(err){
				console.log(err);
				console.log("err at new event");
			}
		});			
		});
		res.redirect("/login");
	});

router.get("/login", middlewareObj.loggedIn,  function(req, res){
	res.render("login",{messages:req.flash("success")});
});
router.post("/login", passport.authenticate("local", {
	failureRedirect:"/login"
}), function(req, res){
	req.flash("success","Welcome, "+ req.user.username);
	res.redirect("/");
});


router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have successfully logged out");
	res.redirect("/login");
});






module.exports=router;