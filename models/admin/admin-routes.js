const express = require('express');
const router = express();
const Admin = require('./admin');
const Events = require('../events/event');
const Students = require('../students/student');
const Clubs = require('../clubs/club');
const Teams = require('../teams/teams');
const Payment = require('../payments/payment');
const adminAuth = require('../../middleware/adminauth');
const Feedback = require('../feedback/feedback');
const ObjectId = require('mongoose').Types.ObjectId;


router.get('/login',function(req,res){
    res.render("admins/login");
});

router.post('/query',function(req,res){
    let data = {
        name:req.body.name,
        email:req.body.email,
        feedback:req.body.feedback
    }
    Admin.updateMany({},{$push:{contactRequests:data}})
    .then((suc)=>{
        return res.redirect('/landing')
    })
    .catch(err=>{
        return res.status(401).redirect('/landing');
    });
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

router.get('/clubs',adminAuth,function(req,res){
    Clubs.find({})
    .then((clubs)=>{
        return res.render("admins/allClubs",{clubs:clubs});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).send("Error");
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

router.get('/events/:eventId',adminAuth,function(req,res){
    Events.findOne({_id:req.params.eventId})
    .then((events)=>{
        return res.render("admins/showEvent",{event:events});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).send({"message":err});
    });
})

router.get('/allTeams/:regn_no',adminAuth,function(req,res){
    Teams.find({"$or":[{"owner_name.regn_no":req.params.regn_no},{"participants.regn_no":req.params.regn_no}]})
    .then((teams)=>{
        return res.status(200).render("admins/allTeams",{teams:teams});
    })
    .catch((err)=>{
        res.status(403).send({"message":"Finding team error"});
    });
});

router.get('/eventsOrganised/:clubId',adminAuth,function (req,res){
    Events.find({ club_id: req.params.clubId })
        .then((events) => {
            return res.status(200).render("admins/allEvents", { events: events });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ "message": "Some Error Occured" });
        })
});

router.get('/clubRatings/:clubId',adminAuth,function(req,res){
    Feedback.aggregate([
        {
            "$lookup": {
                from: 'events',
                localField: 'event_id',
                foreignField: '_id',
                as: 'response'
            }
        },
        {
            "$match": {
                'response.club_id': ObjectId(req.params.clubId)
            }
        }

    ]).exec(function (err, result) {
        if (err)
            return res.status(500).send(err);
        return res.render("students/viewClubRatings", { ratings: result });
    });
});


module.exports = router;