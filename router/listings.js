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


// router.route("/").get(listingController.newData);



//index route, //new route post
router.route("/")
.get(wrapAsync(listingController.indexRender))
.post(isLoggedin,upload.single("listing[image][url]"),validateListing,wrapAsync(listingController.newCreate));


//search route
router.route("/search")
.post(wrapAsync(listingController.searchRender));


//filter route
router.route("/all").get(wrapAsync(listingController.filterAll));
router.route("/trending").get(wrapAsync(listingController.filterTrend));
router.route("/room").get(wrapAsync(listingController.filterRoom));
router.route("/iconic").get(wrapAsync(listingController.filterIconic));
router.route("/mountain").get(wrapAsync(listingController.filterMountain));
router.route("/castles").get(wrapAsync(listingController.filterCastles));
router.route("/pool").get(wrapAsync(listingController.filterPool));
router.route("/camp").get(wrapAsync(listingController.filterCamp));
router.route("/farms").get(wrapAsync(listingController.filterFarms));
router.route("/arctic").get(wrapAsync(listingController.filterArctic));
router.route("/beach").get(wrapAsync(listingController.filterBeach));



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