const mongoose = require('mongoose');
const member = require('./member');

const description = new mongoose.Schema({
    found_date: {
        type:Date,
        required:true
    },
    founders: [String],
    ceo:{
        type:String,
        required:true
    },
    members: [member]
});


module.exports = description;