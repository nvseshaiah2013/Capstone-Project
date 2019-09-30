const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Admin = require('../models/admin/admin');

dotenv.config();

module.exports = (req,res,next)=>{
    let header = req.headers.authorization;
    if(!header) return res.redirect('/admins/login');
    let token = header.split(' ')[1];
    if(token)
    {
        jwt.verify(token, process.env.ADMIN_PB_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(401).json({
                    "message": "Invalid Request",
                    "error": err
                });
            }
            else {
                Admin.findOne({ username: decoded.username }, function (err, admin) {
                    if (err) {
                        res.status(401).json({
                            "message":"Invalid user"
                        })
                    }
                    else {
                        req.currentUser = admin;
                        next();
                    }
                });
            }
        });
    }
    else
    {
        res.status(401).json({
            "message":"Invalid Header"
        })
    }
}
