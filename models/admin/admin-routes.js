const express = require('express');
const router = express();
const Admin = require('./admin');
const Events = require('../events/event');
const Students = require('../students/student');
const Clubs = require('../clubs/club');
const Teams = require('../teams/teams');
const Payment = require('../payments/payment');
const adminAuth = require('../../middleware/adminauth');


router.get('/login',function(req,res){
    res.render("admins/login");
});

router.post('/signout', adminAuth, function (req, response) {
    //console.log(tok);
    Admin.findOneAndUpdate({ _id: req.currentUser._id }, { "$pull": { activeTokens: req.currentUser.token } }, (err, res) => {
        if (err) {
            console.log(err);
            return response.status(403).send({ "message": "Error Logging Out" });
        }
        else {
            return response.status(200).send({ "message": "SignOut Success" });
        }
    });
    //return res.send("Hello");
});


router.post('/dashboard',function(req,res){
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
                                Admin.findOneAndUpdate({username:req.body.username},{"$push":{activeTokens:token}})
                                .catch((err)=>{
                                    return res.status(401).send({ "message": "Login Failed Try Again", "error": err });
                                });
                                return res.render("admins/dashboard", { auth: token, id: admin });
                            }
                        });
                    }
                    else 
                        return res.status(401).send({"message":"Unauthorized"});
                }
            })
        }
    }).catch(err=>{
        return res.status(401).send({ "message": "Unauthorized","error":err });
    })
});

router.post('/sendNotification/student/:studentId', adminAuth, function (req, res) {
    let data = req.body.data;
    let notification = {
        heading: data.heading,
        text: data.text
    };
    Student.findOneAndUpdate({ regn_no: req.params.studentId }, { "$push": { notifications: notification } }, (err, result) => {
        if (err) {
            return res.status(403).send({ "message": "Cannot send Notification" });
        }
        else {
            return res.status(200).send({ "message": "Notification Sent" });
        }
    });
});

router.post('/sendNotification/clubs/:clubId', adminAuth, function (req, res) {
    let data = req.body.data;
    let notification = {
        heading: data.heading,
        text: data.text
    };
    Club.findOneAndUpdate({ _id: req.params.clubId }, { "$push": { notifications: notification } }, (err, result) => {
        if (err) {
            return res.status(403).send({ "message": "Cannot send Notification" });
        }
        else {
            return res.status(200).send({ "message": "Notification Sent" });
        }
    });
});

router.get('/notifications', adminAuth, function (req, res) {
    Admin.findById(req.currentUser._id, { notifications: 1 })
        .then((notifications) => {
            res.status(200).send({ notifications: notifications });
        })
        .catch((err) => {
            res.status(403).send({ "message": "error fetching notifications" });
        })
});

router.post('/signup',function(req,res){
    Admin.create([{username:req.body.username,password:req.body.password}],function(err,doc){
        if(err)
        {
            console.log(err + " Occured");
        }
        else
        {
            console.log("Saved Successfully");
        }
    });
    res.send("Saved");
});

router.get('/students',adminAuth,function(req,res){
    Students.find({},{password:0,secretToken:0})
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
        res.render("admins/allEvents",{events:docs});
    })
    .catch((err)=>{
        res.status(403).send({"message":"Error"});
    });
});

router.get('/allTeams',adminAuth,function(req,res){
    Teams.find({})
    .then((teams)=>{
        return res.status(200).render("admins/allTeams",{teams:teams});
    })
    .catch((err)=>{
        res.status(403).send({"message":"Finding team error"});
    });
});



module.exports = router;