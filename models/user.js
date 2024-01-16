const mongoose=require("mongoose");
const schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchemma=new schema({
    email:{
        type:String,
        required:true,
    },
});

userSchemma.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchemma);