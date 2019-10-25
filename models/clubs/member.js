const mongoose = require('mongoose');

const member = new mongoose.Schema({
    regn_no:String,
    name: String,
    designation: {
        type:String,
        default:'Member'
    }
});


module.exports = member;