const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpError=require("./utils/expressErrror.js");
const listingsRouter=require("./router/listings.js");
const reviewsRouter=require("./router/reviews.js");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const mongoStore=require("connect-mongo");
const flash=require("connect-flash");

const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const userRouter=require("./router/user.js");

const schema=mongoose.Schema;
const app=express();

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(cookieParser("secretcode"));


const atlasUrl=process.env.ATLAS_URL;

const store=mongoStore.create({
    mongoUrl:atlasUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*60*60,
});

store.on("error",()=>{
    console.log("mongo store error",err);
});

const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

//session and passport related data..............
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






async function main(){
    await mongoose.connect(atlasUrl);
};

main().then(()=>{
    console.log("db connected");
}).catch(err=>(console.log(err)));




const port=3000;






//logger......
app.use((req,res,next)=>{
    req.responceTime=new Date().toString();
    console.log("\n","Logger--","\n",req.method,"\n",req.path,"\n",req.responceTime,"\n",req.hostname);
    next();
});

//home
app.get("/",((req,res,next)=>{
    res.redirect("/listings");
}));


app.use((req,res,next)=>{
    res.locals.successmsg=req.flash("success");//it send an array....
    res.locals.errormsg=req.flash("error");
    res.locals.currentUsr=req.user;
    next();
});



//importer files......
app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);    //mergeparams are importent in route.......
app.use("/",userRouter);







//unrelated code........................................
// app.get("/setcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("name","nishkant",{signed:true});
//     res.send("we ar sending cookie");
// });
// app.get("/getcookies",(req,res)=>{
//     let {name="pta nhi"}=req.signedCookies;
//     console.dir(req.signedCookies);
//     res.send(`hello ${name}`);
// });

//.............................................................



//error handler middleware...

app.all("*",(req,res,next)=>{
    next(new ExpError(404,"page not found!"))
});


app.use((err,req,res,next)=>{
    console.log("\n","error Middleware--","\n","----error----");
    next(err);
});

app.use((err,req,res,next)=>{
    let {status=400,message="somthin went wrong"}=err;
    res.status(status).render("listings/error.ejs",{message});
});






app.listen(port,()=>{
    console.log("server connected");
});






