const express = require('express');
const app = express();
const cors = require('cors');
const port =process.env.PORT || 8000;
require('./databse');
app.use(express.json());
const UserAuth = require('./routers/auth');
const videos = require('./routers/videos');
const User= require('./routers/user');
const Channels = require('./routers/channels');

app.use(cors({
    origin:"https://comforting-pastelito-7f045a.netlify.app/",
    methods:["GET","POST","PUT","DELETE"]
}))
app.use('/api/UserAuth',UserAuth);
app.use('/api/videos',videos);
app.use('/api/user',User);
app.use('/api/channel',Channels);



app.get('/',async(req,res)=>{
    try {
        res.send('Connected To this Api...................');
    } catch (error) {
        res.send(error);
    }
})

app.listen(port,()=>{
    console.log(`app is running at ${port} .....`);
})