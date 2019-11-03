const mongoose = require('mongoose');


const categoriesSchema = new mongoose.Schema({   
    category_name:{
        type:String,
        required:true
    },
    group_size:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
});

module.exports = categoriesSchema;