var express=require("express");
var router=express.Router({mergeParams:true});
var passport=require("passport");
var moment = require('moment-timezone');

const middlewareObj = require("../middleware");

var User=require("../models/user"),
	Task=require("../models/task"),
	Event=require("../models/event");

router.post("/event/:id", middlewareObj.isLoggedIn, (req, res)=>{
	var edate=(req.body.edate).toString();
	if(edate.indexOf("-") != -1){
		var d=new Date(edate.slice(0,(edate.indexOf("-")-1)));
		var d1=new Date(edate.slice((edate.indexOf("-")+2),));
		start=moment(d).add(5, 'hours').add(30,'minutes').format();
		end=moment(d1).add(5, 'hours').add(30,'minutes').format();
	
	}
	else{
		console.log(edate);
		var d=new Date(edate);
		console.log(d);
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

router.delete("/event/delete/:id", middlewareObj.checkTaskOwnership, function(req, res){
	Task.findByIdAndRemove(req.params.id, function(err){
		if(err)
			res.redirect("/");
		else
			res.redirect("back");
	});
});

router.get("/edit/:id", middlewareObj.checkTaskOwnership, function(req, res){
	Task.findById(req.params.id, function(err, foundTask){
			res.render("edit",{task:foundTask});
	});
});

router.put("/event/edit/:id", middlewareObj.checkTaskOwnership, function(req, res){
	var edate=(req.body.edate).toString();
	if(edate.indexOf("-") != -1){
		var d=new Date(edate.slice(0,(edate.indexOf("-")-1)));
		var d1=new Date(edate.slice((edate.indexOf("-")+2),));
		start=moment(d).add(5, 'hours').add(30,'minutes').format();
		end=moment(d1).add(5, 'hours').add(30,'minutes').format();
	
	}
	else{
		console.log(edate);
		var d=new Date(edate);
		console.log(d);
		var start=moment(d).add(5, 'hours').add(30,'minutes').format();
		var end=start;
		
	}
	var newEvent= {
		title: req.body.ename,
		description: req.body.edesc,
		start: start,
		end: end,
		background: req.body.ecolor,
		icon: req.body.eicon,
	};
	
	Task.findByIdAndUpdate(req.params.id,newEvent,{new: true}, function(err, updatedCampground){
		if(err){
			console.log(err);
			res.redirect("/");
		}
		else{
			req.flash("success", "Event edited successfully");
			res.redirect("/");
		}
	});
});

router.get("/user/:id",middlewareObj.isLoggedIn, function(req, res){
	var paramid=req.params.id;
		Event.findById(paramid).populate("events").exec((err, foundEvent)=>{
			if(err){

			}
				
			else{

				User.find({}, (err, foundUsers)=>{
					if(err)
						console.log(err)
					else{
						var dstart=moment().startOf('day').add(5, "hours").add(30,"minutes").format();
						var dend=moment().startOf('day').add(1, "days").add(5, "hours").add(30,"minutes").format();
						Task.find( //query today up to tonight
						{
							start: {$gte: dstart, $lt: dend},
							assignedto:req.params.id
						}).sort({ start: 1 }).then(foundTasks=>{
							res.render("calendar",{event:foundEvent.events, userid:req.params.id, people:foundUsers, tasks:foundTasks, moment:moment});
						})
					}

				})

			
			}
		});
});

module.exports=router;