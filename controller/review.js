const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.reviewCreate=async(req,res,next)=>{
    let list=await Listing.findById(req.params.id);
    let reviewData=new Review(req.body.review);
    reviewData.author=req.user._id;
    list.reviews.push(reviewData);

    let data=await reviewData.save();
    await list.save();

    req.flash("success","Review Created!");
    res.redirect(`/listings/${req.params.id}`);
     
};

module.exports.reviewDistroy=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("error","Review Deleted!")
    res.redirect(`/listings/${id}`);
};