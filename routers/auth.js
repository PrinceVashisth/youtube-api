const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');


router.post('/',async(req,res)=>{
  const salt = await bcrypt.genSalt(10);
    const HassPassword = await bcrypt.hash(req.body.password,salt);
    const user =await new User({
     name:req.body.name,
     age:req.body.age,
     email:req.body.email,
     Password:HassPassword
   });
   const respo = await user.save();
   res.send(respo);
});

router.post('/login',async(req,res)=>{
   const user = await User.findOne({email:req.body.email});
   if (!user){
    res.send("Wrong Email");
   } else{
       const bool = await bcrypt.compare(req.body.password,user.Password);
       if(bool){
        const {Password , ...others} = user._doc;
        res.send(others);
       }else{
        res.send("Wrong password");
       } 
   }
})

module.exports = router;