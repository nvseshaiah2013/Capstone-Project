const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Student = require('../models/students/student');

dotenv.config();

module.exports = (req,res,next) => {
    let header = req.headers.authorization;
   // console.log(req.headers);
    if(!header) return res.redirect('/student/login');
   // console.log(req);
    let token = header.split(" ")[1];
   // console.log(token);
    if(token)
    {
        jwt.verify(token,process.env.STUDENT_PB_KEY,(err,decoded)=>{
                if(err)
                {
                    console.log(err);
                    return res.render("ExpireSession");
                }
                else
                {
                    Student.findOne({username:decoded.username},function(err,student)
                    {
                        if(err)
                        {
                            res.render("NotFound404");
                        }
                        else
                        {
                            req.currentUser = student;
                            req.currentUser.token = token;
                            next();
                        }
                    });
                }
        });
    }
    else
        {
            res.status(401).json({                
                    "message": "Invalid Request2"                
            });
        }
}