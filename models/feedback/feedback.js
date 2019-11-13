const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    regn_no:{
        type:String
    },
    event_id:
    {   
        type:mongoose.Schema.Types.ObjectId
    }
    ,
    cat_id:{
        type:mongoose.Schema.Types.ObjectId
    }
    ,
    rating:
    {
        type:Number,
        default:0
    },
    review:{
        type:String,
    }
});

module.exports = mongoose.model('feedback',feedbackSchema);