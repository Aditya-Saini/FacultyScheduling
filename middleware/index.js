var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.loggedIn = (req, res, next)=>{
    if(req.isAuthenticated()){
        return res.redirect("back");
    }
    return next();
}

module.exports = middlewareObj;