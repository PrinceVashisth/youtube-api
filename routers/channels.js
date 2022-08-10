const router = require('express').Router();
const Channel = require('../models/Channel'); 
const user = require('../models/User');
const videos = require('../models/videos');
// Create a channel
router.post('/:id',async(req,res)=>{
  try {
    const chen = await Channel.findOne({channelName:req.body.channelname});
    const User = await user.findById(req.params.id);
    if(!chen && User){
       const channel = await new Channel({
        userId:req.params.id,
        channelName:req.body.channelname,
        channelType:req.body.ctype,
        channelImg:req.body.channelImg,
       });
       await channel.save();
       res.send(channel);
    }else{
      res.send("Channel Already Available");
    }
  } catch (error) {
    res.send(error);
  }
})

// Edit a channel

router.put('/updateChannel/:id/:ChannelName',async(req,res)=>{
    try {
    const result =  await Channel.findOne({$and:[{userId:req.params.id,channelName:req.params.ChannelName}]});
    if(result){
        const updated = await result.updateOne({$set:req.body});
        res.send(updated);
    }else{
        res.send('Channel Not Found');
    }
   } catch (error){
       res.send(error);
    }
   });

// Delete a channel
router.delete('/:id/:ChannelName',async(req,res)=>{
    try {
    const channel =  await Channel.findOne({$and:[{userId:req.params.id,channelName:req.params.ChannelName}]});
    const Videos = await videos.find({userId:channel._id});

      await channel.delete();
      await Videos.delete();
    res.send({Channel,Videos});  
} catch (error){
       res.send(error);
    }
   });

// Get a Channel

router.get('/',async(req,res)=>{
  const userId = req.query.userId;
  const name = req.query.name;
  try {
    const user = userId? await Channel.findById(userId): await Channel.findOne({channelName:name});
    res.send(user);
} catch (error) {
    console.log(error);
} 
});

// Get All Likes on channel

router.get('/channelLikes/:channel',async(req,res)=>{
  let Views=[];
    try{
      const channel = await Channel.findOne({channelName:req.params.channel});
      const Videos = await videos.find({userId:channel._id});
      for (let index=0;index<Videos.length;index++){
        const {views , ...others} = Videos[index];
        Views.push(views);
      }
      res.send(Views);
    } catch (error){
      res.send(error);
    }
})


   
module.exports = router;