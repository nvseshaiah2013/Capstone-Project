const express = require('express');
const router = express();
const Admin = require('./admin');
const Events = require('../events/event');
const Students = require('../students/student');
const Clubs = require('../clubs/club');
const adminAuth = require('../../middleware/adminauth');


router.get('/login',function(req,res){
    res.render("admins/login");
});

router.post('/login',function(req,res){
    Admin.findOne({username:req.body.username}).then(admin=>{
        if(admin)
        {
            admin.comparePwd(req.body.password,function(err,success){
                if(err) throw err;
                else
                {
                    if(success){

                        admin.genJWT(function(err,token){
                            if (err) console.log("Token Error: " + err);
                            else {
                                res.render("admins/dashboard", { auth: token, id: admin });
                            }
                        });
                    }
                    else res.status(403).send({"message":"Unauthorized"});
                }
            })
        }
    }).catch(err=>{
        res.status(401).send({ "message": "Unauthorized","error":err });
    })
})

// router.post('/signup',function(req,res){
//     Admin.create([{username:req.body.username,password:req.body.password}],function(err,doc){
//         if(err)
//         {
//             console.log(err + " Occured");
//         }
//         else
//         {
//             console.log("Saved Successfully");
//         }
//     });
//     res.send("Saved");
// });

router.get('/students',adminAuth,function(req,res){
    Students.find({},{password:0})
    .then((docs)=>{
        res.render("admins/allStudents",{students:docs});
    })
    .catch((err)=>{
        res.status(403).send({"message":"Some Error Occured"});
    });
});


router.get('/events',adminAuth,function(req,res){
    Events.find({})
    .then((docs)=>{
        res.render("events/allEvents",{events:docs});
    })
    .catch((err)=>{

    });
});

router.get('/allTeams',adminAuth,function(req,res){

});



module.exports = router;