const db = 'mongodb+srv://vashisthprince9:xHAxEgsEm6HEpL4v@cluster0.kvocefs.mongodb.net/?retryWrites=true&w=majority';
// const db = 'mongodb://127.0.0.1:27017/YoutubeClone';
const mongoose = require('mongoose');
mongoose.connect(db).then(()=>{
    console.log("Database connected");
}).catch((e)=>{
    console.log(e);
})