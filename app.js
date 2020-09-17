var express=require('express'),
    app=express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res)=>{
    res.render("calender")
});

app.listen(3000, ()=>(
    console.log("Faculty Server\nListening on port 3000:")
))