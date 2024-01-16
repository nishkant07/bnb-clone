const User=require("../models/user.js");


module.exports.signupRender=(req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signupCreate=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUsr=new User({email,username});
    let regUsr=await User.register(newUsr,password);
    console.log(regUsr);
    req.login(regUsr,(err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Now you are registerd in Wanerlust");
    res.redirect("/listings");
    });
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    };

};

module.exports.loginRender=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{
    if(!res.locals.redirectUrl){
req.flash("success","Welcome to Wanderlust");
};
req.flash("success","Now you Logged In!");
let redirecturl=res.locals.redirectUrl || "/listings";
res.redirect(redirecturl);
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged you Out!");
        res.redirect("/listings");
    })
};