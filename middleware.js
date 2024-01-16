const Listing=require("./models/listing.js");
const ExpError=require("./utils/expressErrror.js");
const {listingSchema, reviewSchema}=require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be loginn for this!");
        res.redirect("/login");
    }
    next();
};

module.exports.saveredirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


module.exports.isowner=async(req,res,next)=>{
    const {id}=req.params;
    const list=await Listing.findById(id);
      if(res.locals.currentUsr&&!list.owner.equals(res.locals.currentUsr._id)){
        req.flash("error","you are not owner of this listing!");
        return res.redirect(`/listings/${id}`);
      }
      next();
};



//validation joi function 1.
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>{el.message}).join(",");
        throw new ExpError(400,error);
    }else{
        next();
    }
};


//validation joi function 2.
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>{el.message}).join(",");
        throw new ExpError(400,error);
    }else{
        next();
    }
};



module.exports.isauthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
      if(res.locals.currentUsr&&!review.author.equals(res.locals.currentUsr._id)){
        req.flash("error","you are not author of this review!");
        return res.redirect(`/listings/${id}`);
      }
      next();
};

