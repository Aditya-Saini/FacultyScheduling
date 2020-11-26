var express=require("express");
var router=express.Router();
var passport=require("passport");
const middlewareObj = require("../middleware");
var User=require("../models/user"),
	middleware=require('../middleware');

router.get("/", middleware.isLoggedIn, function(req, res){
	res.render("calendar");
});


router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	console.log(req.body);
	var newUser=new User({username:req.body.name, email:req.body.email, phone:req.body.phone});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register",{error:err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Welcome to YelpCamp"+ user.username);
			res.redirect("/calender");
		});
	});
});

router.get("/login", middlewareObj.loggedIn,  function(req, res){
	res.render("login");
});
router.post("/login", passport.authenticate("local", {
	successRedirect:"/",
	failureRedirect:"/login"
}), function(req, res){
	
});


router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "logged you Out!");
	res.redirect("/");
});


module.exports=router;