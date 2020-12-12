var middlewareObj = {},
    Task=require("../models/task");


middlewareObj.checkTaskOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           Task.findById(req.params.id, function(err, foundTask){
              if(err){
                  req.flash("error","Task Not Found");
                  res.redirect("back");
              }  else {
                  // does user own the Task?
               if(foundTask.assignedby.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error","You Don't have permission to do that");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error","You need to be logged in to do that");
           res.redirect("back");
       }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to log in");
    res.redirect("/login");
}

middlewareObj.loggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        req.flash("error", "To change user log out");
        return res.redirect("/");
    }
    return next();
}

module.exports = middlewareObj;