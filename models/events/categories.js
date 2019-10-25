const mongoose = require('mongoose');

const winner = new mongoose.Schema({
    _id:false,
    team_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    position:{
        type:String,
        default:"None"
    }
});

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