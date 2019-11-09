const mongoose = require('mongoose');

//Success Response

/*

   {
    "TXNID":"20180926111212800110168766100018551",
    "BANKTXNID":"5583250",
    "ORDERID":"order1",
    "TXNAMOUNT":"100.12",
    "STATUS":"TXN_SUCCESS",
    "TXNTYPE":"SALE",
    "GATEWAYNAME":"WALLET",
    "RESPCODE":"01",
    "RESPMSG":"Txn Success",
    "BANKNAME":"WALLET",
    "MID":"rxazcv89315285244163",
    "PAYMENTMODE":"PPI",
    "REFUNDAMT":"0.00",
    "TXNDATE":"2018-09-26 13:50:57.0"
}
*/

// Failure Response

/* 
{
    "TXNID":"20180927111212800110168666800020875",
    "BANKTXNID":"",
    "ORDERID":"order1",
    "TXNAMOUNT":"100.12",
    "STATUS":"PENDING",
    "TXNTYPE":"SALE",
    "RESPCODE":"810",
    "RESPMSG":"Txn Failed",
    "MID":"rxazcv89315285244163",
    "REFUNDAMT":"0.0",
    "TXNDATE":"2018-09-27 10:07:15.0"
}

*/



let payment = new mongoose.Schema({
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
        required: true,
        default:"-1"
    },
    ORDERID: {
        type: String,
        required: true,
        index:true,
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
        default:"Failure"
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
        default:"Failure"
    },
    MID: {
        type: String,
    },
    PAYMENTMODE: {
        type: String,
        required: true,
        default:"Failure"
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