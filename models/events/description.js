const mongoose = require('mongoose');

const description = new mongoose.Schema({
    _id:false,
    venue:
    {
        type:String,
        default:"To be Declared Soon"
    },
    misc_details:{
        type:String,
        default:"Event is going to be very nice"
    },
    prizes_worth:{
        type:Number,
        default:0
    }
});

module.exports = description;