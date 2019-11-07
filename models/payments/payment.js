const mongoose = require('mongoose');

let payment = new mongoose.Schema({
    _id:false,
    teamId:{
        type:mongoose.Schema.Types.ObjectId,
        index:true
    },
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
    },
    TXNID: {
        type: String,
        index: true,
    },
    BANKTXNID: {
        type: String,
        required: true
    },
    ORDERID: {
        type: String,
        required: true,
    },
    TXNAMOUNT:{
        type:String,
        required:true,
    },
    STATUS:{
        type:String,
        required:true,
    },
    TXNTYPE:{
        type:String,
    },
    GATEWAYNAME: {
        type: String,
        required: true,
    },
    RESPCODE:{
        type:String,
        required:true,
    },
    RESPMSG: {
        type: String,
        required: true,
    },  
    BANKNAME: {
        type: String,
        required: true,
    },
    MID: {
        type: String,
    },
    PAYMENTMODE: {
        type: String,
        required: true,
    },
    TXNDATE: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    TAMPERED_FLAG:{
        type:Boolean,
        default:false
    }   
});


module.exports = mongoose.model('payment',payment);