if(process.env.NODE_ENV!="production"){
require("dotenv").config();
};

const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedin,isowner,validateListing}=require("../middleware.js");
const listingController=require("../controller/listing.js");
const multer =require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});




//index route, //new route post
router.route("/")
.get(wrapAsync(listingController.indexRender))
.post(isLoggedin,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.newCreate));



//new route
router.get("/new",isLoggedin,listingController.newRender);




//show detail route, //edit, //delete route
router.route("/:id")
.get(wrapAsync(listingController.showRender))
.put(isLoggedin,isowner,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.editCreate))
.delete(isLoggedin,isowner,wrapAsync(listingController.distroyCreate));




//edit route
router.get("/:id/edit",isLoggedin,isowner,wrapAsync(listingController.editRender));




module.exports=router;