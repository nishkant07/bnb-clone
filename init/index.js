const mongoose=require("mongoose");
const lisdata=require("./data.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

main().then(()=>{
    console.log("db connected");
}).catch(err=>(console.log(err)));



const initdb=async()=>{
  await Listing.deleteMany({});
   lisdata.data= lisdata.data.map((obj)=>({...obj,owner: "659d57c8fa056f140098a957"}));
  await Listing.insertMany(lisdata.data).then(()=>console.log("data added to db"))
.catch(err=>console.log(err)); 
};

initdb();









//add reviess

let sampleReview=[
    { comment: "Amazing place! Loved it.", rating: 5 },
  { comment: "Great atmosphere and friendly staff.", rating: 4 },
  { comment: "Good food, but service could be improved.", rating: 3 },
  { comment: "Cozy and comfortable. Would visit again.", rating: 5 },
  { comment: "Unique experience. Highly recommended.", rating: 4 },
  { comment: "Average. Nothing special.", rating: 2 },
  { comment: "Exceptional service! Will definitely come back.", rating: 5 },
  { comment: "The ambiance is fantastic, but the food was just okay.", rating: 3 },
  { comment: "Lovely place for a quiet evening.", rating: 4 },
  { comment: "Disappointing. Expected more.", rating: 2 },
  { comment: "Outstanding! One of my favorite spots.", rating: 5 },
  { comment: "Decent prices and good quality. Worth a try.", rating: 4 },
  { comment: "Not recommended. Had a bad experience.", rating: 1 },
  { comment: "Nice location. Enjoyed the view.", rating: 4 },
  { comment: "Overpriced for what it offers.", rating: 2 },
  { comment: "Charming and welcoming. A hidden gem.", rating: 5 },
  { comment: "The staff was helpful, and the place was clean.", rating: 4 },
  { comment: "Could improve on the menu variety.", rating: 3 },
  { comment: "Absolutely terrible. Avoid at all costs.", rating: 1 },
  { comment: "Great value for money. Will be back soon.", rating: 5 },
];




//push
let datas=async()=>{
    let id="658e7d35af60a6e9c7465f4d";
    let list=await Listing.findById(id);
    for(data of sampleReview){
        let reviewdata=new Review(data);
        list.reviews.push(reviewdata);

        await reviewdata.save();
        await list.save();
    }
 

}
// datas();






