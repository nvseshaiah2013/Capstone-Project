const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const salt_factor = 10;

dotenv.config();

const eventSchema = new mongoose.Schema({
    event_id:mongoose.Schema.Types.ObjectId,
    event_name:String,
    date:Date
});

const Student = new mongoose.Schema({
    regn_no:{
        type:String,
        required:true,
        unique:true
    },
    name: {
        type:String,
        required:true,

    },
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone_no:
    {
        type:String,
        required:true
    },
   events:[eventSchema],
   reg_date:{
       type:Date,
       default:Date.now()
   },
   profile_pic:{
       type:String,
       default:'../../public/assets/21294.png'
   },
   expired_tokens:{
       type:[String]
   }
});


Student.methods.genJWT = function genJWT(cb)
{   
   let student = this;
   jwt.sign({username:this.username},process.env.STUDENT_PR_KEY,{expiresIn:"2h"},function(err,token){
        if(err)
        {
           // console.log("Error in signing token for user: " + student.username);
            cb(err);
        }
        else
        {
          //  console.log("Token Generated for username: " + student.username + " " + token);
            cb(null,token);
        }
    });
}

Student.pre('save',function(next){
    var student = this;

    // only hash the password if it has been modified (or is new)
    if (!student.isModified('password')) return next();

       // hash the password using our new salt
        bcrypt.hash(student.password, salt_factor, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            student.password = hash;
            next();
        });
})




Student.methods.comparePwd = function(password,cb){
   // console.log(this.password);
    bcrypt.compare(password,this.password,function(err,result){
        if(err) return cb(err);
        cb(null,result);
    });
}

module.exports = mongoose.model('Student',Student);

