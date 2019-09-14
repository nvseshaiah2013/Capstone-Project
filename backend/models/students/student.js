const mongoose = require('../../db/db');
const eventSchema = new mongoose.Schema({
    event_id:mongoose.Schema.Types.ObjectId,
    event_name:String,
    date:Date
});

const Student = new mongoose.Schema({
    regn_no:{
        type:String,
        index:true,
        unique:true,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    email_id:{
        type:String,
        unique:true,
        required:true
    },
    phone_no:
    {
        type:[String]
    },
   events:[eventSchema],
   password:{
       type:String,
       required:true
   },
   reg_date:Date,
   profile_pic:{
       type:String,
       default:'../../public/assets/21294.png'
   }
});


module.exports = mongoose.model('Student',Student);

