var mongoose = require('mongoose');
var bcrypt=require("bcrypt-nodejs");
var crypto=require("crypto");

var Schema=mongoose.Schema;

var userSchema=new Schema({
    email:{type:String, unique: true,lowercase:true},
    password: String,
    profile: {
        name:{type:String, default:""},
        picture:{type:String, default:""},
    },
    history:[{
        date: Date,
        paid:{type:Number,default:0}
    }],
    address: {type:String,default: ""}
});

//this hashes the password field value before saving it to the database
//this assumes you have given the password a value before saving it to the database
userSchema.pre("save",function(next){
    var user=this;
    if(!user.isModified("password")) return next();//go to next operation if password is not given a value
    bcrypt.genSalt(10,function(err,salt){
        if(err) return next(err);
        bcrypt.hash(user.password,salt,null,function(err,hash){ //hash the password and return it as hash in the function parameter
            if(err) return next(err);
            user.password=hash; //assigning the hash value to password again which is now ready to be saved into the database
            next();
        });
    });
});

//comparing the password in the database and the one user types in
userSchema.methods.comparePassword=function(password){
    return bcrypt.compareSync(password,this.password);
}

userSchema.methods.gravatar=function(size){
    if(!this.size) size=200;
    if(!this.email) return "https://gravatar.com/avatar/?s"+size+"&d=retro";
    var md5=crypto.createHash("md5").update(this.email).digest("hex");
    return "https://gravatar.com/avatar/"+md5+"?s="+size+"&d=retro";
}

module.exports=mongoose.model("User",userSchema);