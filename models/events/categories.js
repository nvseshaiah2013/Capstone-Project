const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    catId:{
        type:Number,
        index:true,
        unique:true
    },
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