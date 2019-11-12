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
        default:"Multiple team registrations are not allowed if anyone does, all the team members will be disqualified."
    },
    prizes_worth:{
        type:Number,
        default:0
    }
});

module.exports = description;