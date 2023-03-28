const mongoose = require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},

    email:{type:String, unique:true, required:true },
    
    Password:{ type:String, required:true },
    
    profilePhoto:{ type:String },
    
    age:{ type:Number, required:true },
    
    subscribed:{ type:Array, default:[] },
    
    watchHistory:{ type:Array, default:[]},
    
    SearchHistory:{type:Array, default:[] },
    
    LikesVideos:{type:Array, default:[] },
    
    comments:{type:Array, default:[]},
    
    ReportedVideos:{ type:Array, default:[]},

    WatchLater:{type:Array,default:[]},

},{timestamps:true});

module.exports = new mongoose.model("User",UserSchema);