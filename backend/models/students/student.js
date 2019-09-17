const mongoose = require('mongoose');
const localMongoose = require('passport-local-mongoose');
const eventSchema = new mongoose.Schema({
    event_id:mongoose.Schema.Types.ObjectId,
    event_name:String,
    date:Date
});

const Student = new mongoose.Schema({
    regn_no:{
        type:String,
        default:0
    },
    name: {
        type:String,
        defualt:"ABC"
    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    phone_no:
    {
        type:String
    },
   events:[eventSchema],
   reg_date:{
       type:Date,
       default:Date.now()
   },
   profile_pic:{
       type:String,
       default:'../../public/assets/21294.png'
   }
});

Student.plugin(localMongoose);

module.exports = mongoose.model('Student',Student);

