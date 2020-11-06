var express=require('express'),
    app=express(),
    bodyParser=require("body-parser"),
    mongoose=require('mongoose'),
    passport=require('passport'),
    flash=require('connect-flash'),
    methodOverride=require('method-override'),
    localStrategy=require('passport-local');

var	User=require("./models/user");

var indexRoutes=require('./routes/index');

mongoose.connect("mongodb://localhost/faculty_scheduling", {useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true}).then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log("Error:",err.message);
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret:"FacultyScheduling Project",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);


app.listen(3000, ()=>{
    console.log("Faculty Server\nListening on port 3000:");
});