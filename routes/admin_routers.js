var router=require("express").Router();
var Category=require("../schemas/category");

router.get("/add-category",function(req,res,next){
    res.render("admin/add_category",{title:"Add Category",message_failure: req.flash("failure"),message:req.flash("success")});
});

router.post("/add-category",function(req,res,next){
    Category.findOne({name: req.body.name.toLowerCase()}).exec()
        .then(function(found){
            if(found){
                req.flash("failure","Category already exists");
                return res.redirect("add-category");
            }
            var category=new Category();
            category.name=req.body.name;

            category.save(function(err){
                if(err) return next(err);
                req.flash("success","New Category added Successfully");
                return res.redirect("add-category");
            });
        })
        .catch(function(err){
            if(err) return next(err);
        })
});
router.get("/admin",function(req,res){
    res.render("admin/admin_page",{title:"Admin Dashboard"});
});
module.exports=router;
