const express = require('express');
const app = express();
const port = 8000;
require('./databse');
app.use(express.json());
const UserAuth = require('./routers/auth');
const videos = require('./routers/videos');
const User= require('./routers/user');
const Channels = require('./routers/channels');

app.use('/api/UserAuth',UserAuth);
app.use('/api/videos',videos);
app.use('/api/user',User);
app.use('/api/channel',Channels);
app.listen(port,()=>{
    console.log(`app is running at ${port} .....`);
})