const mongoose = require('mongoose');
const desc = require('./description');
const category = require('./categories');

const eventSchema = new mongoose.Schema({
    event_name:{
        type:String,
        unique:true,
        required:true
    },
    club_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    start_date:{
        type:mongoose.Schema.Types.Date,
        required:true,
        index:true
    },
    end_date:{
        type:mongoose.Schema.Types.Date,
        required:true
    },
    reg_deadline:{
        type:mongoose.Schema.Types.Date,
        required:true
    },
    description:{
        type:desc
    },
    categories:{
        type:[category],
        required:true
    }
});

module.exports = mongoose.model('Event',eventSchema);