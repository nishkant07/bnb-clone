const mongoose=require("mongoose");
const schema=mongoose.Schema;
const Review=require("./review.js");


const listingSchema=new schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage",
              },
        url:{
        type:String,
        default:"https://images.unsplash.com/photo-1702512155043-3306b72feb0c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v)=>v===""?"https://images.unsplash.com/photo-1702512155043-3306b72feb0c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v
    }},
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
        type:schema.Types.ObjectId,
        ref:"Review",
        }
     ],
     owner:{
        type:schema.Types.ObjectId,
        ref:"User",
     },
     geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});


listingSchema.post("findOneAndDelete",async(data)=>{
    if(data){
        let res=await Review.deleteMany({_id:{$in:data.reviews}});
        console.log(res);
    }
});


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;