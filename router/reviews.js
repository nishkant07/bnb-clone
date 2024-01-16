const express=require("express");
const router=express.Router({mergeParams:true});//mmerge paramms.....
const wrapAsync=require("../utils/wrapAsync.js");
const{validateReview, isLoggedin, isauthor, isowner}=require("../middleware.js");
const reviewController=require("../controller/review.js");


//review post route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewController.reviewCreate));


//review delete   route...
router.delete("/:reviewId",isLoggedin,isauthor,wrapAsync(reviewController.reviewDistroy));



module.exports=router;