const mongoose = require('mongoose');
const VideoSchema=new mongoose.Schema({
  
   userId:{ type:String, required:true },
  
   title:{ type:String, required:true },
  
   desc:{ type:String, required:true },
  
   thumbnail:{ type:String },
  
   video:{ type:String, required:true },
  
   likes:Array,
  
   views:Array,
  
   comments:Array,
  
   reports:Array,
  
   AgeRestriction:{ type:Boolean, default:false }

},{timestamps:true});

module.exports = new mongoose.model("Video",VideoSchema);