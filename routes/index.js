var express=require("express");
var router=express.Router({mergeParams:true});
var passport=require("passport");
const middlewareObj = require("../middleware");
var User=require("../models/user"),
	Task=require("../models/task"),
	Event=require("../models/event")

router.get("/", function(req, res){
	console.log("at home now");
	console.log(req.user._id);
	Event.findById(req.user._id).populate("events").exec((err, foundEvent)=>{
		if(err)
			console.log(err);
		else
			res.render("calendar",{event:foundEvent.events, userid:req.user._id});
	});
	
});

router.post("/event/:id", middlewareObj.isLoggedIn, (req, res)=>{
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
		// TODO: Improve security insted of finding by object id using different method.
		assignedto:req.params.id,
		assignedby:req.user._id
	});
	
	Event.findById(req.user._id, (err, foundEvent)=>{
		if(err)
			console.log(err);
		else{
			Task.create(newEvent, (err, data)=>{
				if(err)
					console.log(err);
				else{
					data.save();
					foundEvent.events.push(data);
					foundEvent.save();
					res.redirect("/");
				}
			});
		}
	});
});


router.get("/register", middlewareObj.loggedIn, function(req, res){
	res.render("register");
});

router.post("/register", middlewareObj.loggedIn, function(req, res){
	//console.log(req.body);
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
			passport.authenticate("local")(req, res, function(){
					req.flash("success","Welcome to YelpCamp"+ user.username);
					res.redirect("/");
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