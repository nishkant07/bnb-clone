const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController=require("../controller/users.js");


//signupRender, //signupCreate
router.route("/signup")
.get(userController.signupRender)
.post(wrapAsync(userController.signupCreate));




//loginRender, //loginByPassport
router.route("/login")
.get(userController.loginRender)
.post(saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
userController.login);




//logoutByPassport
router.get("/logout",userController.logout);




module.exports=router;