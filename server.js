var express = require('express');
var mongoose=require("mongoose");
var app = express();

var session=require("express-session");
var flash=require("express-flash");
var cookieParser=require("cookie-parser");
var secret=require("./configuration/secret");
var Category=require("./schemas/category");
//store session on the mongoDB instead of default memory store
var MongoStore=require("connect-mongo")(session);
var passport=require("passport");

var logger = require('morgan');
var bodyParser = require('body-parser');
var jsonParser=bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });

//reqiure this to work with ejs files
var ejs=require("ejs");
var ejsmate=require("ejs-mate");
var path=require("path");

//connect to the database
mongoose.connect(secret.database,function(err){
    if(err){console.log(err);}
    else{console.log("database connected");}
});
//tell express u are using static files in public folder and it sub directories
app.use(express.static(path.join(__dirname,"public")));
//calls the routers defined in routes folder
var routers=require("./routes/index");
var urouters=require("./routes/urouters");
var admin_routers=require("./routes/admin_routers");
var api_routers=require("./api/api");
/* for passport to work with session, the middleware must be arranged in order below */
// Parse request body into req.body.*
app.use(jsonParser);
app.use(urlencodedParser);
//to use session and cookie
app.use(cookieParser());
app.use(session({
    resave :true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({url:secret.database,autoReconnect: true})
}));
app.use(flash());
//initializing passport for use in express
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.user=req.user;
    next();
});
app.use(function(req,res,next){
    Category.find({},function(err,result){
        if(err) return next(err);
        res.locals.category=result;
        next();
    });
});

// Log all requests
app.use(logger('dev'));

//this must be set to work with ejs files located in views folder
app.engine("ejs",ejsmate);
app.set("view engine","ejs");

//using the routers module in index.js and urouters of routes folder
app.use("/api",api_routers);
app.use(routers);
app.use(urouters);
app.use(admin_routers);

app.listen(secret.port);
console.log('Listening on port '+secret.port);

