const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Student = require('../models/students/student');

dotenv.config();

module.exports = (req,res,next) => {
    let header = req.headers.authorization;
    let token = header.split(" ")[1];
    if(token)
    {
        jwt.verify(token,process.env.STUDENT_PB_KEY,(err,decoded)=>{
                if(err)
                {
                    res.status(401).json({
                        "message":"Invalid Request",
                        "error" : err
                    });
                }
                else
                {
                    Student.findOne({username:decoded.username},function(err,student)
                    {
                        if(err)
                        {
                            next(err,false);
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
                    "message": "Invalid Request"                
            });
        }
}