var express = require("express");
var app = express();
var name = "gaurav";
var city = "jaipur";
               
app.listen(3000);
app.get("/home",(req,res) =>{
	console.log(name+" is from "+city);
});

console.log("i will be executed without waiting for read file");
console.log("at the end of the file");
