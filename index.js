var express = require("express");
var bodyParser = require('body-parser')
var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set("view engine","ejs");

app.get("/",function(req,rep){
	rep.send("Home Page");
})
app.get("/home",function(req,rep){
	rep.render("Home");
})
app.get("/about",function(req,rep){
	rep.send("About Page");
})
app.get("/contact",function(req,rep){
	rep.render("Contact");  
})
app.post("/Contact" , urlencodedParser , function(req,rep){
	rep.render("sucess" , {data: req.body})
})
app.get('/profile/:id',function(req,rep){
	var info = {age : 29 , city : "jaipur" , hobby : ['fighting','swimming','jogging','yoga']};
    rep.render("profile",{info : info ,  person : req.params.id});  
});
app.listen("3000",function(){
	console.log("Server started at port 3000")
})