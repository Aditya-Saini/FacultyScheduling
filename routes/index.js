var express=require("express");
var router=express.Router();
var passport=require("passport");
const middlewareObj = require("../middleware");
var User=require("../models/user"),
	Task=require("../models/task");

router.get("/", middlewareObj.isLoggedIn, function(req, res){
	Task.find({}, (err, event)=>{
		if(err)
			console.log(err);
		else
			res.render("calendar",{event:event});
	});
	
});

router.post("/event", middlewareObj.isLoggedIn, (req, res)=>{
	var edate=req.body.edate;
	var start=edate.slice(0,(edate.indexOf("-")-1));
	var end=edate.slice((edate.indexOf("-")+2),);
	console.log(start,end);
	var newEvent= new Task({
		title: req.body.ename,
		description: req.body.edesc,
		start: start,
		end: end,
		background: req.body.ecolor,
		icon: req.body.eicon,
		assignedto:"lil",
		assignedby:"lul"
	});
	Task.create(newEvent, (err, data)=>{
		if(err)
			console.log(err);
		else
			res.redirect("/");
	});
	console.log(newEvent);
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