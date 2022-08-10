const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({

   userId:{ type:String, required:true,},

   channelName:{ type:String, required:true, unique:true },
   
   channelVideos:{type:Array, default:[]},
   
   channelImg:{ type:String, default:"" },
   
   channelType:{ type:String, default:"" },
   
   subscribers:{ type:Array, default:[] }

},{timestamps:true});

module.exports = new mongoose.model('Channel',channelSchema);