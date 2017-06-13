var express=require("express");
var router=express.Router();
var path=require("path");

router.get("/index",function(req,res){
    res.sendFile(__dirname+"/css/index.html");
    console.log(__dirname);
});

module.exports=router;
