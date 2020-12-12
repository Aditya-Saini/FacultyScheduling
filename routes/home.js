var express=require("express");
var router=express.Router({mergeParams:true});
var passport=require("passport");
var moment = require('moment-timezone');

const middlewareObj = require("../middleware");

var User=require("../models/user"),
	Task=require("../models/task"),
	Event=require("../models/event");

router.get("/",middlewareObj.isLoggedIn, function(req, res){

	Event.findById(req.user._id).populate("events").exec((err, foundEvent)=>{
		if(err)
			console.log(err);
		else{
			Event.findById(req.user._id).populate("future").exec((err, futureEvent)=>{
				if(err)
					console.log(err);
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
								assignedto:req.user._id
							}).sort({ start: 1 }).then(foundTasks=>{

								res.render("calendar",{event:foundEvent.events, userid:req.user._id, futureTask:futureEvent,people:foundUsers, tasks:foundTasks, moment:moment, messages:req.flash("success")});
							
								});
						}
					});
				}
			});
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
	
	}
	else{
		console.log(edate);
		var d=new Date(edate);
		console.log(d);
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
						if(a!=-1)
							freeUsers.splice(a,1);
						
					}
				console.log("final:",freeUsers);
				});
				
				
		}
	});
	res.redirect("/");
});

module.exports=router;