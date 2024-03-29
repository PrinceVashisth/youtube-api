const router = require('express').Router();
const User = require('../models/User');
const Channel = require('../models/Channel');
const videos = require('../models/videos');

// Get A User
router.get('/:id',async(req,res)=>{
  const {Password,...user} = await User.findById(req.params.id);
  res.send(user._doc);
})

// Subscribe a Channel or unsubscribed
router.put('/:id',async(req,res)=>{
  try {
    const channel = await Channel.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if(!channel.subscribers.includes(req.body.userId)){
      await channel.updateOne({$push:{subscribers:req.body.userId}});
      await currentUser.updateOne({$push:{subscribed:req.params.id}});
        res.send("You subscribed this Channel");
    }else{
      await channel.updateOne({$pull:{subscribers:req.body.userId}});
      await currentUser.updateOne({$pull:{subscribed:req.params.id}});
    res.send("you  unsubscribed this account");
    }
  } catch (error) {
    res.send(error);
  }
})


// Like / remove_like
router.put('/like/:id',async(req,res)=>{
   try {
     const video = await videos.findById(req.params.id);
     const currUser = await User.findById(req.body.userId);
     if(!video.likes.includes(req.body.userId)){
       await video.updateOne({$push:{likes:req.body.userId}})
       await currUser.updateOne({$push:{LikesVideos:req.params.id}})
     res.send('you like a video');
     }else{
       await video.updateOne({$pull:{likes:req.body.userId}})
       await currUser.updateOne({$pull:{LikesVideos:req.params.id}})
       res.send('you remove like on a video');
     }
   } catch (error) {
    res.send(error);
   }
})


// Comment on a video
// router.put('/comment/:id',async(req,res)=>{
       
// });


// Seen a video
router.put('/video/:id',async(req,res)=>{
  try {
    const video = await videos.findById(req.params.id);
    await video.updateOne({$push:{views:req.body.userId}}); 
    const currUser = await User.findById(req.body.userId);
    if(!currUser.watchHistory.includes(req.params.id)){
      await currUser.updateOne({$push:{watchHistory:req.params.id}});
      res.send("user View this video");
    }else{
      res.send("user already See that Video");
    }

  } catch(error){
    res.send(error);
  }
});

// delete a history
router.put('/remove/:id',async(req,res)=>{
  try {
    const currUser = await User.findById(req.body.userId);
    if(currUser.watchHistory.includes(req.params.id)){
      const result = await currUser.updateOne({$pull:{watchHistory:req.params.id}});
      res.send(result);  
     }
     else{
      res.send(" Not in Watch List ");
     }
  } catch(error){
    res.send(error);
  }
});

// Delete all Videos From History
router.put('/video/remove/removeAll',async(req,res)=>{
  try {
    const currUser = await User.findById(req.body.userId);
    const Videos =[...currUser.watchHistory];
    const result = await currUser.updateOne({$pullAll:{watchHistory:Videos}});
    res.send(result);
  } catch(error){
    res.send(error);
  }
});

// Search A Video without User
router.get('/search/:title',async(req,res)=>{
    try {
      const Videos = await videos.find( { "$or":[{title:{ $regex:req.params.title}}] } );
    res.send(Videos);
    } catch (error) {
      res.send(error);
    } 
});

// Search Query When User Is Present
router.get('/search/data/:title',async(req,res)=>{
  const userId = req.query.userId;
    try {
      const user = await User.findById(userId);
      const Videos = await videos.find( { "$or":[{title:{ $regex:req.params.title}}] } );
      await user.updateOne({$push:{SearchHistory:req.params.title}});
      res.send(Videos);
    } catch (error) {
      res.send(error);
    } 
});

// Delete Searched video
router.put('/deleteSearched/:video',async(req,res)=>{
  try {
     const user = await User.findById(req.body.userId);
      await user.updateOne({$pull:{SearchHistory:req.params.video}});
     res.send("Deleted");
  } catch (error) {
    res.send(error);
  } 
});

// Delete all Searched video
router.put('/DeleteAllSearched',async(req,res)=>{
  try {
     const user = await User.findById(req.body.userId);
      await user.update({$pull:{SearchHistory}});
     res.send("ALl Videos deleted");
  } catch (error) {
    res.send(error);
  } 
});

// Report a Video
router.put('/report/video/:id',async(req,res)=>{
  try {
    const Video  = await videos.findById(req.params.id);
     const user = await User.findById(req.body.userId);
     if(!user.ReportedVideos.includes(req.params.id)){
       await user.updateOne({$push:{ReportedVideos:req.params.id}});
       await Video.updateOne({$push:{reports:req.body.userId}})
       res.send("Video has Been Reported");
     }else{
      await user.updateOne({$pull:{ReportedVideos:req.params.id}});
      await Video.updateOne({$pull:{reports:req.body.userId}})
      res.send("Your Report has been removed");      
     }
  } catch (error) {
    res.send(error);
  } 
});
 
// See All Reported Videos
router.get('/seeReports/Videos/:id',async(req,res)=>{
     const user = await User.findById(req.params.id);
     let Videos=[];
     for(let count=0;count<user.ReportedVideos.length;count++){
      const video = await videos.findById(user.ReportedVideos[count]);
      Videos.push(video);
     }
     res.send(Videos);
});

// Get All Channel From a User's Channel
router.get('/getAllChannels/:cname',async(req,res)=>{
    try {
    const channel = await Channel.findOne({channelName:req.params.cname}); 
    const user = await User.findById(channel.userId);
    const channels = await Channel.find({userId:user._id});
    res.send(channels);
    } catch (error) {
      res.send(error);
    }
});

router.get('/findChannels/User/Channel/:id',async(req,res)=>{
 try{
  const channels = await Channel.find({userId:req.params.id});
  res.send(channels);
  } catch (error) {
    res.send(error);
  }
})

// Put a video in WatchLater Videos
router.put('/getvideo/Video/:id',async(req,res)=>{
     const user = await User.findById(req.body.userId);
     if(user.WatchLater.includes(req.params.id)){
       await User.updateOne({$pull:{WatchLater:req.params._id}});
      res.send("Added To WatchLater"); 
     }
});

// get all Watch Later Videos
// router.get('/getVideo/:id',async(req,res)=>{
//   let Videos=[];  
//   const user = await User.findById(req.params.id);
//     for(let i=0;i<user.WatchLater.length;i++){
//      const video = await videos.findById(user.WatchLater[i]);
//       Videos.push(video);
//     }
// });

module.exports=router;