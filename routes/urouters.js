//file where account routers are defined
var router=require("express").Router();
var User=require("../schemas/user");
var passport=require("passport");
var configPassport=require("../configuration/passport");

router.get("/login",function(req,res){
   if(req.user) return res.redirect("/profile");
    res.render("login",{title:"Login Page",message: req.flash("loginMessage")});
});
router.post("/login",
    passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true })
);
router.get("/profile",function(req,res,next){
    User.findOne({_id:req.user._id}, function(err,result){
        if(err) return next(err);
        res.render("files/profile",{title:"Profile",user:result});
    });
});

router.get("/signup",function(req,res){
    res.render("signup",{title:"Sign up",errors:req.flash("errors")});
});
router.post("/signup",function(req,res,next){

    User.findOne({email: req.body.email},function(err,result){
        if(result){
            req.flash("errors","account with this email address already exists");
            res.redirect("/signup");
        }
        else{
            var user=new User();
            user.email=req.body.email;
            user.profile.name=req.body.name;
            user.password=req.body.password;
            user.profile.picture=user.gravatar();

            user.save(function(err){
                if(err) return next(err);
                req.logIn(user,function(err){
                    if(err) next(err);
                    return res.redirect("/profile");
                });
            });
        }
    });

});
router.get("/logout",function(req,res,next){
    req.logout();
    res.redirect("/");
});

router.get("/edit-profile",function(req,res){
    res.render("files/edit_profile",{title:"edit-profile",message:req.flash("success")});
});
router.post("/edit-profile",function(req,res,next){
   User.findOne({_id:req.user._id},function(err,user){
       if(err) return next(err);

       if(req.body.name) user.profile.name=req.body.name;
       if(req.body.address) user.address=req.body.address;

       user.save(function(err){
           if(err) return next(err);
           req.flash("success","profile successfully updated");
           return res.redirect("/edit-profile");
       });
   });
});
module.exports=router;