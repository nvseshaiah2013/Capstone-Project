const mongoose = require('mongoose');

mongoose.set("useCreateIndex",true);

mongoose.connect(
    'mongodb://localhost:27017/lpu_colors',
    { 
        useNewUrlParser:true,
        useUnifiedTopology:true 
    }).then(succ=>{
        console.log("Successfully Connected to DB");
    }).catch(err=>{
        console.log("Error: " + err);
    });

mongoose.connection.on('connected',()=>{
    console.log("Database Connected!");
});

mongoose.connection.on('error',(err) => {
    console.log("Database Connect Failed with - :" + err);
});

module.exports = mongoose;