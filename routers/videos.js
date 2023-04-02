const router = require('express').Router();
const User = require('../models/User');
const videos = require('../models/videos');
const Channel = require('../models/Channel');
// Create a Video this id is of channel  

router.post('/:id',async(req,res)=>{
  try {
      const Video = await new videos({
          userId:req.params.id,
          title:req.body.title,
          desc:req.body.desc,
          thumbnail:req.body.thumbnail,
          video:req.body.video
      });
   const channel = await Channel.findById(req.params.id);
   await Video.save();
   await channel.updateOne({$push:{channelVideos:Video._id}});   
     res.send("Video has been uploaded");            
  } catch (error) {
      res.send(error);
  }
});

// Edit a Video
router.put('/:id',async(req,res)=>{
    try {
    const video = await videos.findById(req.params.id);
   if(video){
     const result = await video.updateOne({$set:req.body});
     res.send(result);
   }else{
       res.send("You Video Not Found");
   }  
    } catch (error) {
       res.send(error); 
    }
});

// Delete A Video
router.delete('/:id',async(req,res)=>{
  try {
    const video = await videos.findByIdAndDelete(req.params.id);
    if(video)
    res.send("video Has Been Deleted"); 
  } catch (error) {
    res.send(error);
  }
});

// Get A Video
router.get('/video/:id',async(req,res)=>{
  const V = await videos.findById(req.params.id);
  res.send(V);
})

// Get All Videos without user
router.get('/all',async(req,res)=>{
      let Videos=[];
        try {
           Videos = await videos.find({AgeRestriction:0});
        res.send(Videos); 
      } catch (error) {
        res.send(error);
      }
});

// Get All Video when user Present
router.get('/all/UserPresent',async(req,res)=>{
  const userId = req.query.userId;
  let Videos=[];
    try {
     const user = await User.findById(userId);
     if(user.age>18){
     Videos = await videos.find();
     }else{
       Videos = await videos.find({AgeRestriction:0});
     } 
    res.send(Videos); 
  } catch (error) {
    res.send(error);
  }
});

// Get All subscribers video
router.get('/AllSubscribersVideo/:id',async(req,res)=>{
  let Videos=[];
    try {
     const user = await User.findById(req.params.id);
     const Subscribedchannels = await Channel.find({_id:user.subscribed});

  for(let i=0;i<Subscribedchannels.length;i++){
    const Vid = await videos.find({_id:Subscribedchannels[i].channelVideos});
    Videos.push(Vid);
  }   
     res.send(Videos);
  } catch (error) {
    res.send(error);
  }
});


// Get All Liked Videos
router.get('/like/:id',async(req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    const Videos = await videos.find({_id:user.LikesVideos});
    res.send(Videos);
  } catch (error) {
    res.send(error);
  }
});

// Get All History
router.get('/history/:id',async(req,res)=>{
  try {
    const user = await User.findById(req.params.id);
    const Videos = await videos.find({_id:user.watchHistory});
    res.send(Videos);
  } catch (error) {
    res.send(error);
  }
});

// Get Recommended Videos
router.get('/video/recommended/:id',async(req,res)=>{
  let Videos=[];
  try {
    const channel = await Channel.findById(req.params.id);
    const findAllChannel = await Channel.find({channelType:channel.channelType});
    for(let c = 0;c < findAllChannel.length;c++){
     const Vid = await videos.find({userId:findAllChannel[c]._id});
     Videos.push(Vid);
    }
    res.send(Videos); 
  } catch (error) {
    res.send(error);
  }
})

// Recommended Video
router.get('/video/selectedCatagory/:catagory',async(req,res)=>{
  let Videos=[];
  try {
    const channel = await Channel.find({channelType:req.params.catagory});
    for(let index=0;index<channel.length;index++){
      const Video = await videos.find({userId:channel[index]._id});
      Videos.push(Video);
    }
    res.send(Videos);
  } catch (error) {
    res.send(error);
  }
})

// Get All Video Of a Channel
router.get('/subsVideo/:username',async(req,res)=>{
  try {
   const channel = await Channel.findOne({channelName:req.params.username});
   const Videos = await videos.find({userId:channel._id});
   res.send(Videos); 
  } catch (error){
    res.send(error);
  }
});

module.exports = router;