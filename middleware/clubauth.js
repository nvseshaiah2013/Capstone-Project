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
                res.render("ExpireSession");
            }
            else {
                Club.findOne({ username: decoded.username }, function (err, club) {
                    if (err) {
                       res.render("NotFound404");
                    }
                    else {
                        req.currentUser = club;
                        req.currentUser.token = token;
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