var express = require('express');
var app = express();

var mongoose=require("mongoose");
var User=require("./user");
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: true });
var jsonParser=bodyParser.json();

app.use(urlencodedParser);
app.use(jsonParser);

//connect to the database
mongoose.connect("mongodb://127.0.0.1/skul",function(err){
    if(err){console.log(err);}
    else{console.log("database connected");}
});

app.post("/create",function(req,res,next){
    var user=new User();
    user.state=req.body.state;
    user.lga=req.body.lga;
    user.age=req.body.age;
    user.name.fname=req.body.fname;
    user.name.lname=req.body.lname;


    user.save(function(err){
        if(err) return next(err);
        res.json("new user created successfully");
    });
})

app.listen(4000,function(err){
    if(err)console.log(err);
    else console.log("listening to port 4000");
})


