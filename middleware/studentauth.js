const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Student = require('../models/students/student');

dotenv.config();

module.exports = (req,res,next) => {
    let header = req.headers.authorization;
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
                    res.status(401).json({
                        "message":"Invalid Request1",
                        "error" : err
                    });
                }
                else
                {
                    Student.findOne({username:decoded.username},function(err,student)
                    {
                        if(err)
                        {
                            res.status(401).json({
                                "message":"Invalid User"
                            })
                        }
                        else
                        {
                            req.currentUser = student;
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