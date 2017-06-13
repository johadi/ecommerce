//files where main routers are defined
var express=require("express");
var router=express.Router();
var Product=require("../schemas/product");

function paginate(req,res,next){
    var perPage=9;
    var current_page=req.params.page != undefined ? req.params.page: 1;
    var skip_items=perPage*(current_page-1); // i.e page2 items=9*(2-1) =9*1= 9 items will be skipped. page2 items displays from item 10
    var previous_page=parseInt(current_page) - 1;
    var next_page=parseInt(current_page) + 1;

    Product
        .find()
        .skip(skip_items)
        .limit(perPage)
        .populate("category")
        .exec(function(err,result){
            if(err) return next(err);
            Product.count().exec(function(err,count){
                if(err) return next(err);
                var has_previous_page=previous_page >= 1 ? true: false;
                var has_next_page=next_page <= count/perPage ? true: false;

                res.render("files/product_main",{
                    products:result,
                    pages:count/perPage,
                    current_page: current_page,
                    next_page: next_page,
                    previous_page: previous_page,
                    has_next_page: has_next_page,
                    has_previous_page: has_previous_page,
                    title:"Home Page - Product"
                });
            });
        });
}

router.get("/about",function(req,res){
    res.render("about",{title:"About us"});
});

router.get("/contact",function(req,res){
    res.render("contact",{title:"Contact"});
});
router.get("/",function(req,res,next){
    if(req.user){
        paginate(req,res,next);
    }else{

        res.render("home",{title:"Home Page"});
    }

});
router.get("/page/:page",function(req,res,next){
    paginate(req,res,next);
});

//route for single category page
router.get("/products/:id",function(req,res,next){
    Product
        .find({category: req.params.id})
        .populate("category")
        .exec(function(err,results){
            if(err) return next(err);
            res.render("files/category",{title:results[0].category.name, products:results
            });
        });
});

//route for single product page
router.get("/product/:id",function(req,res,next){
    Product.findById({_id:req.params.id},function(err,result){
        if(err) return next(err);
        //return res.status(200).json(result);
        res.render("files/product",{
           title:result.name, product:result
        });
    });
});
module.exports=router;
