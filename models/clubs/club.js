const mongoose = require('mongoose');
const contactDetails = require('./contact');
const description = require('./description');

const clubSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    username:{
        type:String,
        unique:true
    },
    contact:contactDetails,
    desc:description,
    reg_date:{
        type:Date,
        default:Date.now()
    }
});


module.exports = mongoose.model('Club',clubSchema);


