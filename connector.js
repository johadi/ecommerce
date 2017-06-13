var express = require('express');
var app = express();


var logger = require('morgan');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
//calls the routers defined in index.js of routes folder
var routers=require("./routes/index");
var htmlrouters=require("./public/htmlroutes");
//reqiure this to work with ejs files
var ejs=require("ejs");
var ejsmate=require("ejs-mate");
var path=require("path");

//tell express u are using static files in public folder and it sub directories
app.use(express.static(path.join(__dirname+"/public")));
// Log all requests
app.use(logger('dev'));
// Serve static files
//app.use(express.static(__dirname));
// Parse request body into req.body.*
app.use(urlencodedParser);

//this must be set to work with ejs files located in views folder
app.engine("ejs",ejsmate);
app.set("view engine","ejs");

//using the routers module in index.js of routes folder
app.use(routers);
app.use(htmlrouters);
//app.use(routers.about);
//app.use(routers.contact);
// Route for specific URLs

// Fire it up!
app.listen(3000);
console.log('Listening on port 3000');
