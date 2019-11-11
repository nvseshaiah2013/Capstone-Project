const mongoose = require('mongoose');

const owner = new mongoose.Schema({
    _id:false,
    regn_no: {
        type: String,
        required: true,
        index:true
    },
    name: {
        type: String
    }
});

const events = new mongoose.Schema({
    _id:false,
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        index:true,
        required:true
    },
    event_id:{
        type:mongoose.Schema.Types.ObjectId,
        index:true,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isRefunded:{
        type:Boolean,
        default:false
    },
    payment_status:{
        type:String,
        default:'Not Paid'
    }
});

const certificate = new mongoose.Schema({
    club_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true
    },
    cat_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        index:true
    },
    src:{
        type:String,
        required:true,
    },
    issuedOn:{
        type:Date,
        default:Date.now()
    }
});


const team = new mongoose.Schema({
    team_name:{
        type:String,
        required:true
    },
    owner_name:owner,
    participants:[owner],
    isDeleted:{
        type:Boolean,
        default:false
    },
    isFinal:{
        type:Boolean,
        default:false
    },
    date_created:{
        type:Date,
        default:Date.now()
    },
    events_participated:[events],
    certificates:[certificate]
});

module.exports = mongoose.model('team',team);