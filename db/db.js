const mongoose = require('mongoose');

mongoose.set("useCreateIndex",true);

mongoose.connect(
    'mongodb://localhost:27017/lpu_colors',
    { 
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    }).then(succ=>{
        console.log("Successfully Connected to DB" );
    }).catch(err=>{
        console.log("Error: " + err);
    });


module.exports = mongoose;