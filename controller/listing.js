const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken=process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
const lisdata=require("../init/data.js");



//data initialise.....

// module.exports.newData=async(req,res)=>{
//     await Listing.deleteMany({});
//     for(list of lisdata.data){
//         list.owner="65a6651b833c1b3732246f15";
//         let responce=await geocodingClient.forwardGeocode({
//             query: list.location,
//             limit: 1
//           }).send();
//           list.geometry=responce.body.features[0].geometry;
//           let newlist=new Listing(list);
//           let data=await newlist.save();
//           console.log(data);

//     }
//     res.send("done");
// };




module.exports.indexRender=async(req,res,next)=>{
    const alllisting=await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
};





//search render.......
module.exports.searchRender=async(req,res,next)=>{
    let {query}=req.body;
    query=query.charAt(0).toUpperCase()+query.slice(1).toLowerCase();
    console.log(query);
    const alllisting=await Listing.find({country:`${query}`});
    console.log(alllisting);
    res.render("listings/index.ejs",{alllisting});
};



//filterRender.....
module.exports.filterAll=async(req,res,next)=>{
    const alllisting=await Listing.find({});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterTrend=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Trending"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterRoom=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Rooms"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterIconic=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Iconic Cities"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterMountain=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Mountain"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterCastles=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Castles"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterPool=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Amazing Pool"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterCamp=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Camping"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterFarms=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Farms"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterArctic=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Arctic"});
    res.render("listings/index.ejs",{alllisting});
};
module.exports.filterBeach=async(req,res,next)=>{
    const alllisting=await Listing.find({category:"Beach"});
    res.render("listings/index.ejs",{alllisting});
};








module.exports.newRender=(req,res,next)=>{
    try{
    res.render("listings/new.ejs")
    }catch(err){
        next(err);
    }
};

module.exports.showRender=async(req,res,next)=>{
    let {id}=req.params;
    const list= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
};



module.exports.newCreate=async(req,res,next)=>{

    console.log(req.body.listing);

    let location=`${req.body.listing.location},`+`${req.body.listing.country}`;
    let responce=await geocodingClient.forwardGeocode({
        query: location,
        limit: 1
      }).send();


    let {path:url,filename}=req.file;
    console.log(req.file);
    let newData=new Listing(req.body.listing);
    newData.owner=req.user._id;//adding new owner......
    newData.image={url,filename};//alsothat can be use {url:path,filename}
    newData.geometry=responce.body.features[0].geometry;

    let data=await newData.save();
    console.log(data);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.editRender=async(req,res,next)=>{
    let {id}=req.params;
    let list=await Listing.findById(id);
    if(!list){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl=list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{list,originalImageUrl});

};

module.exports.editCreate=async(req,res,next)=>{

    let location=`${req.body.listing.location},`+`${req.body.listing.country}`;
    let responce=await geocodingClient.forwardGeocode({
        query: location,
        limit: 1
      }).send();


    let {id}=req.params;
    let list=await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators:true});//run validator is requiredd....
    list.geometry=responce.body.features[0].geometry;
    await list.save();
    if(typeof req.file !="undefined"){
        let {path,filename}=req.file;
        list.image={url:path,filename};
        
        await list.save();
    }
    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);  
};

module.exports.distroyCreate=async(req,res,next)=>{
    let {id}=req.params;
    let deletedlisting =await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("error","Listing Deleted!");
    res.redirect("/listings");
};