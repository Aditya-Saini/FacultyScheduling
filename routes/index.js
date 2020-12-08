var express=require("express");
var router=express.Router({mergeParams:true});
var passport=require("passport");
var moment = require('moment-timezone');
const middlewareObj = require("../middleware");
const user = require("../models/user");
var User=require("../models/user"),
	Task=require("../models/task"),
	Event=require("../models/event")

router.get("/",middlewareObj.isLoggedIn, function(req, res){
	//console.log("at home now");
	//console.log(req.user._id, new Date().toISOString);
	/*console.log(Task.find( //query today up to tonight
		{
			assignedto:req.user._id,
			"start": {"$gte": new Date(2020, 12, 4), "$lt": new Date()}}));*/
			
	Event.findById(req.user._id).populate("events").exec((err, foundEvent)=>{
		if(err)
			console.log(err);
		else{
			
			User.find({}, (err, foundUsers)=>{
				if(err)
					console.log(err)
				else{
					/*var d= new Date();
					var dnow = d.setDate(d.getDate() - 1);
					var dend = d.setDate(d.getDate() + 2);*/
					var dstart=moment().startOf('day').add(5, "hours").add(30,"minutes").format();
					var dend=moment().startOf('day').add(1, "days").add(5, "hours").add(30,"minutes").format();
					//console.log(dstart, dend);
					Task.find( //query today up to tonight
					{
						start: {$gte: dstart, $lt: dend},
						assignedto:req.user._id
					}).sort({ start: 1 }).then(foundTasks=>{
						console.log(foundTasks);
							
						res.render("calendar",{event:foundEvent.events, userid:req.user._id, people:foundUsers, tasks:foundTasks, moment:moment});
				
						});
				}
			});
		}
	});
	
});



router.post("/event/:id", middlewareObj.isLoggedIn, (req, res)=>{
	var edate=(req.body.edate).toString();
	if(edate.indexOf("-") != -1){
		var d=new Date(edate.slice(0,(edate.indexOf("-")-1)));
		var d1=new Date(edate.slice((edate.indexOf("-")+2),));
		start=moment(d).add(5, 'hours').add(30,'minutes').format();
		end=moment(d1).add(5, 'hours').add(30,'minutes').format();
		//console.log(start,end);
	
	}
	else{
		console.log(edate);
		var d=new Date(edate);
		console.log(d);
		//var start=moment(d).format("isoDateTime").add(5, 'hours').add(30,'minutes').format();
		var start=moment(d).add(5, 'hours').add(30,'minutes').format();
		var end=start;
		
	}
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

	
	Event.findById(req.params.id, (err, foundEvent)=>{
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

router.get("/user/:id",middlewareObj.isLoggedIn, function(req, res){
	Event.findById(req.params.id).populate("events").exec((err, foundEvent)=>{
		if(err)
			console.log(err);
		else{
			
			User.find({}, (err, foundUsers)=>{
				if(err)
					console.log(err)
				else
					res.render("calendar",{event:foundEvent.events, userid:req.params.id, people:foundUsers});
			})
			
		
		}
	});
	
});

router.post("/find",middlewareObj.isLoggedIn,(req, res)=>{
	var edate=req.body.edate
	if(edate.indexOf("-") != -1){
		var d=new Date(edate.slice(0,(edate.indexOf("-")-1)));
		var d1=new Date(edate.slice((edate.indexOf("-")+2),));
		start=moment(d).add(5, 'hours').add(30,'minutes').format();
		end=moment(d1).add(5, 'hours').add(30,'minutes').format();
		//console.log(start,end);
	
	}
	else{
		console.log(edate);
		var d=new Date(edate);
		console.log(d);
		//var start=moment(d).format("isoDateTime").add(5, 'hours').add(30,'minutes').format();
		var start=moment(d).add(5, 'hours').add(30,'minutes').format();
		var end=start;
		
	}
	User.find({}, (err, foundUsers)=>{
		if(err)
			console.log(err)
		else{
			var freeUsers=[],a;
			for(i=0;i<foundUsers.length;i++){
				freeUsers.push(
					foundUsers[i]._id.toString()
				);
				console.log("id:",foundUsers[i]._id);
			}
			Task.find( //query today up to tonight
				{
					start: {$gte: start, $lt: end}
				}).sort({ start: 1 }).then(foundTasks=>{
					console.log("tasks:",foundTasks);
					for(i=0;i<foundTasks.length;i++){
						a=freeUsers.indexOf(foundTasks[i].assignedto.toString());
						console.log(a);
						freeUsers.splice(a,1);
						console.log("final:",freeUsers);
					}
					
				});
				
		}
	});
	res.redirect("/");
});

/*router.get("/:id",middlewareObj.isLoggedIn, function(req, res){
	console.log("at home now");
	console.log(req.user._id);
	console.log(req.params.id);
	Event.findById(req.params.id).populate("events").exec((err, foundEvent)=>{
		if(err)
			console.log(err);
		else
			res.render("calendar",{event:foundEvent.events, userid:req.user._id});
	});
	
});
*/
module.exports=router;