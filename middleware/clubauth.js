const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Club = require('../models/clubs/club');

dotenv.config();

module.exports = (req,res,next) =>
{
    let header = req.headers.authorization;
    if(!header) return res.redirect('/clubs/login');
    

    let token = header.split(" ")[1];
   // console.log(token);
    //console.log(process.env.CLUB_PB_KEY);
    if(token)
    {
        jwt.verify(token, process.env.CLUB_PB_KEY, (err, decoded) => {
            if (err) {
                console.log(err);
                res.status(401).json({
                    "message": "Invalid Request1",
                });
            }
            else {
                Club.findOne({ username: decoded.username }, function (err, club) {
                    if (err) {
                        res.status(401).json({
                            "message":"Club username invalid"
                        });
                    }
                    else {
                        req.currentUser = club;
                        next();
                    }
                });
            }
        });
    }
    else
        {
            res.status(401).json({"message":"Invalid Request"});
        }
};