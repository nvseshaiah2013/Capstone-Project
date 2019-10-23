const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set("useCreateIndex",true);

mongoose.connect(
    process.env.MONGODB_URL,
    { 
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    }).then(succ=>{
        console.log("Successfully Connected to DB " + succ);
    }).catch(err=>{
        console.log("Error: " + err);
    });


module.exports = mongoose;