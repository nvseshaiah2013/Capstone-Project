const express = require('express');
const router = express();
const moment = require('moment');
const Student = require('./student');
const Events = require('../events/event');
const Team = require('../teams/teams');
const studentAuth = require('../../middleware/studentauth');
const adminAuth = require('../../middleware/adminauth');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/login', function (req, res) {
    res.render("students/Login");
});

router.get('/signup', function (req, res) {
    res.render("students/sign-up");
});


router.get('/allStudents', adminAuth, function (req, res) {
    Student.find({}).then(students => {
        return res.status(200).render("students/allStudents", { students: students });
    }).catch(err => {
        console.log("/allStudents Route: " + err);
        return res.status(400).send({ "message": "Error" });
    });
});

router.post('/signup', function (req, res) {
    // console.log(req.body.data.username);

    Student.findOne({ regn_no: req.body.data.reg_no }).then(user => {
        if (user) {
            console.log("User Already Exists " + req.body.data.reg_no);
            res.status(401).json({ "message": "Registration No Already Used" });
            res.end();
        }
        else {
            Student.findOne({ username: req.body.data.username }).then(user => {
                if (user) {
                    console.log("Email Id already Taken " + req.body.data.reg_no);
                    res.status(401).json({ "message": "Email Id already Exists" });
                    res.end();
                }
                else {
                    var student = new Student({
                        username: req.body.data.username,
                        password: req.body.data.password,
                        regn_no: req.body.data.reg_no,
                        name: req.body.data.name,
                        phone_no: req.body.data.phone_no
                    });
                    let team = new Team({
                        "owner_name.regn_no": req.body.data.reg_no,
                        "team_name": "Individual",
                        "owner_name.name": req.body.data.name,
                        "isFinal": true
                    });
                    team.save(function (err, doc) {
                        if (err) console.log("Individual Team Creation Failed " + err);
                        else {
                            student.myTeams.push(doc._id);
                            //console.log(doc);
                        }
                        student.save();
                    });
                    //console.log(student + " Inserted\n");
                    res.status(200).send({ "message": "Success" });
                }
            }).catch(err => {
                console.log("Error: " + err);
            })
        }

    }).catch(err => {
        console.log("error occured" + err);
    })
});

router.post('/dashboard', function (req, res) {
    Student.findOne({ username: req.body.username }).then(user => {
        if (user) {
            user.comparePwd(req.body.password, function (err, result) {
                if (err) throw err;
                if (result) {
                    user.genJWT(function (err, token) {
                        if (err) console.log("Token Error: " + err);
                        else {
                            res.render("students/dashboard", { auth: token, id: user });
                        }
                    });
                }
                else {
                    res.render("students/Login",{"message":"Login Failed - Wrong Username/Password"});
                }
            });

        }
        else {
            res.render("students/Login", { "message": "Login Failed - Wrong Username/Password" });
        }
    }).catch(err => {
        res.render("students/Login", { "message": "Login Failed - Wrong Username/Password" });
    });
});

router.post('/signout',studentAuth,function(req,response){
    //console.log(tok);
    Student.findOneAndUpdate({username:req.currentUser.username},{"$push":{expiredTokens:req.currentUser.token}},(err,res)=>{
        if(err)
            {
                console.log(err);
                return response.status(403).send({"message":"Error Logging Out"});
            }
        else
            {
                return response.status(200).send({"message":"SignOut Success"});
            }
    });
    //return res.send("Hello");
});

router.get('/events', studentAuth, function (req, res) {
    // console.log("reached event Route");
    Events.find({}).then(docs => {
        res.render("events/allEvents", { events: docs });
    }).catch(err => {
        res.status(404).send({ "message": "Error" });
    })
});

router.get('/teams', studentAuth, function (req, res) {
    var teams = new Object();
    Team.find({ "owner_name.regn_no": req.currentUser.regn_no, isDeleted: false }, { isDeleted: 0, date_created: 0 })
        .then((docs) => {
            // console.log(docs);
            teams.owner = [...docs];
            Team.find({ "participants.regn_no": req.currentUser.regn_no, isDeleted: false }, { isDeleted: 0, date_created: 0 })
                .then((docs) => {
                    //console.log(docs);
                    teams.participant = [...docs];
                    //console.log("Team: \n" + teams.participant);
                    // console.log(teams);
                    return res.render("students/allTeams", { allTeams: teams });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(401).send({ "message": "Failed to load participant designation" });
                });
        })
        .catch((err) => {
            console.log(err);
            return res.status(401).send({ "message": "Failed to Team Details" });

        });

});

//Creates a new Team
router.post('/teams', studentAuth, function (req, res) {
    if (!req.body.data) return res.status(401).send({ "message": "No Data Received" });
    let team = new Team({
        "owner_name.regn_no": req.currentUser.regn_no,
        "team_name": req.body.data.team_name,
        "owner_name.name": req.currentUser.name,
    });
    team.save((err, docs) => {
        if (err) {
            console.log(err);
            return res.status(401).send({ "message": "Team Creation Unsuccessful" });
        }
        else {
            Student.findOneAndUpdate({ regn_no: req.currentUser.regn_no }, { "$push": { myTeams: docs._id } })
                .then(succ => {
                    return res.status(200).send({ "message": "Team successfully created" });
                })
                .catch(fail => {
                    console.log("Student Document Id Addition Failed for " + req.currentUser.regn_no + " " + fail);
                    return res.status(401).send({ "message": "Team Id Addition in Student Document Failed" });
                });
            return res.status(200).send({ "message": "Team Successfully Created" });
        }
    });
}); 

//Adds a new member to the team
router.post('/teams/:id/addMember', studentAuth, function (req, res) {
    console.log(req.body.data);
    const teamId = req.params.id;
    var member = {
        regn_no: req.body.data.regn_no,
        secretToken: req.body.data.secretToken
    };
    Student.findOne({ regn_no: member.regn_no }, function (err, docs) {
        if (err) return res.status(401).send({ "message": "Error Occured" });
        else {
            if (docs && docs.secretToken === member.secretToken) {
                Team.findOne({ _id: teamId })
                    .then(team => {
                        if(team && team.isFinal){
                            return res.status(401).send({"message":"The team is already marked Final"});
                        }
                        else if (team && !team.isFinal && team.owner_name.regn_no !== member.regn_no &&  team.participants.length <= 3) {
                           let index = team.participants.find((value) => {
                                return member.regn_no == value['regn_no'];
                            });
                                if(!index){
                                    team.participants.push({"regn_no":member.regn_no,"name":docs.name});
                                    team.save((err,success)=>{
                                        if(err) 
                                            {
                                                console.log(err);
                                                return res.status(401).send({ "message": "Team Member Addition Failed" });
                                            }
                                        else 
                                            {
                                                console.log("Save Successfull");
                                                return res.status(200).send({"message":"Added Successfully"});
                                            }
                                    });
                                }
                                else{
                                    console.log("User Already Exists In Team");
                                    return res.status(401).send({ "message": "User Already Exists In Team" });
                                }
                        }
                        else
                            {
                                console.log("Team Member Addition Failed");
                                return res.status(401).send({ "message": "Team Member Addition Failed" });
                            }
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(401).send({ "message": "Team Member Addition Failed" });
                    })
            }
            else {
                return res.status(401).send({ "message": "Wrong Token or No Such Student Exists" })
            }
        }
    });

});



router.post('/teams/:id/markFinal',studentAuth,function(req,res){
    let id = req.params.id;
    Team.findOneAndUpdate({_id:id},{"$set":{isFinal:true}})
    .then((docs)=>{
        if(!docs) {
            console.log("Team Not Found");
        }
        else{
            //console.log("Team Marked as Final");
            return res.status(200).send({"message":"Team Marked as Final"});
        }
    })
    .catch((err)=>{
        console.log(err);
        return res.status(401).send({"message":"Updation Failed"});
    });
});

//Event Registration through Team
router.post('/:categoryId/register/:teamId',studentAuth,function(req,res){
    Team.findOne({_id:req.params.teamId,isFinal:true,"owner_name.regn_no":req.currentUser.regn_no},(err,teams)=>{
        if(err) {
            console.log("Error:" + err);
            return res.status(401).send({"message":"Error Occured in Registration"});
        }
        if(!teams)
        {
            console.log("No Team Found!");
            return res.statusCode(401).send({"message":"Team Id is wrong or you are not owner of the Team"});
        }
        else
        {
            Events.findOne({"categories._id":req.params.categoryId},{"categories.$":1},(err,events)=>{
                if(err){
                    console.log("Error: " + err);
                    return res.status(401).send({"message":"Error Occured in Registration"});
                }
                if(!events)
                {
                    return res.status(401).send({"message":"Event Invalid"});
                }
                else{
                    // console.log("teams.participants" + teams.participants.length);
                    // console.log( events.categories);
                    // res.send("Happy");
                    if(moment(Date.now()).isAfter(events.reg_deadline))
                        return res.status(403).send({"message":"Event Registration Deadline Over"});
                    if ((teams.participants.length + 1) === (events.categories[0].group_size) && !teams.events_participated.find(function (value) {
                        return value.cat_id == req.params.categoryId;
                    }))
                    {
                       //console.log( );
                        teams.events_participated.push({cat_id:req.params.categoryId,"payments.status":"Not Paid"});
                        teams.save((err,succ)=>{
                            if(err){
                                console.log("Save error" + err);
                            }
                            else{
                                console.log(succ);
                                return res.status(200).send({"message":"Successfully Registered"});
                            }
                        });
                        // res.send("S");
                    }
                    else
                    {
                        return res.status(401).send({"message":"Already Error Occured"});
                    }
                }
            });
        }

    });
});

router.post('/:categoryId/deregister/:teamId', studentAuth,function (req, res) {
    Event.findOne({"categories.cat_id":req.params.categoryId},{"categories.$":1})
    .then((event)=>{
        if(event)
        {
            if(!(moment(Date.now()).isAfter(event.reg_deadline)))
            Team.findOne({ "events_participated.cat_id": req.params.categoryId, _id: req.params.teamId, "owner_name.regn_no": req.currentUser.regn_no })
                .then((team) => {
                    if (team) {
                        let index = team.events_participated.findIndex(function (value) {
                            return value.cat_id == req.params.categoryId;
                        });
                        if (team.events_participated[index].payments.status === 'Not Paid') {
                            team.events_participated.splice(index, 1);
                            team.save((err, success) => {
                                if (!err)
                                    return res.status(200).send({ "message": "Deregister Successfull" });
                            });
                        }
                        else {
                            res.status(403).send({ "message": "You cannot deregister as you have already paid" });
                        }
                    }
                    else {
                        res.status(403).send({ "message": "Unauthorized Request or You are Not registered" });
                    }
                })
                .catch((err) => {
                    return res.status(403).send({ "message": "Deregistration Unsuccessful" });
                });
            else
                return res.status(403).send({"message":"Deadline Passed"});

        }
        else
        {
            return res.status(200).send({"message":"No such category"});
        }
    })
    .catch((err)=>{
        return res.status(403).send({"message":"No Such Event"})
    });
});


router.get('/:categoryId/Ownedteams',studentAuth,function(req,res){
    Events.findOne({"categories._id":req.params.categoryId},{"categories.$":1},(err,events)=>{
        if(err) {
            console.log(err);
            return res.send(401).send({"message":"AError Occured"});
        }
        else{

            // console.log("\nevents:" + events);
            let val = parseInt(events.categories[0].group_size) - 1;
            // console.log(val);
            Team.find({ "owner_name.regn_no": req.currentUser.regn_no, participants: { "$size": val },isFinal:true},function(err,teams){
            if(err) {
                console.log(err);
                return res.status(401).send({"message":"Error Occured"});
            }
            // console.log("\nTeams:" + teams);
            res.render("students/showOwnTeams",{teams:teams});
        });
    }
    });
});

router.get('/:categoryId/teams',studentAuth,function(req,res){
    Events.findOne({ "categories._id": req.params.categoryId }, { "categories.$": 1 }, (err, events) => {
        if (err) {
            console.log(err);
            return res.send(401).send({ "message": "AError Occured" });
        }
        else {

            // console.log("\nevents:" + events);
            let val = parseInt(events.categories[0].group_size) - 1;
            // console.log(val);
            Team.find({ "participants.regn_no": req.currentUser.regn_no, participants: { "$size": val }, isFinal: true }, function (err, teams) {
                if (err) {
                    console.log(err);
                    return res.status(401).send({ "message": "Error Occured" });
                }
                // console.log("\nTeams:" + teams);
                return res.render("students/showMemberTeams",{ teams: teams });
            });
        }
    });
});

router.get('/:teamId/participation',studentAuth,function(req,res){
    // Team.findOne({_id:req.params.teamId}).exec
    Team.aggregate([
        {
            "$match":{ _id:ObjectId(req.params.teamId) }
        },
        {
            "$lookup":{
                from:'events',
                localField: "events_participated.cat_id",
                foreignField: "categories._id",
                as: 'participation'
            }
        }
    ]).exec(function(err,result)
    {
        if(err)
        {
            console.log(err);
            return res.status(403).send({"message":err});
        }
        else
        {
            return res.status(200).send({events:result})
        }
    });
});



//GET EVENT DETAILS BY ID

router.get('/:eventId/details',studentAuth,function(req,res){
    Events.findById(req.params.eventId,(err,docs)=>{
        if(err) return res.status(401).send({"message":"Error Occured"});
        return res.render("events/showEvent",{event:docs});
    });
});

router.get('/upcomingEvents',studentAuth,function(req,res){
    let today = moment(new Date()).format('YYYY-MM-DD');
    today = today + "T00:00:00.000Z";
    Events.find({start_date:{"$gte":new Date(today)}})
    .then((docs)=>{
        res.status(200).send({events:docs});
    })
    .catch((err)=>{
        res.status(403).send({"message":err});
    });    
});

router.get('/liveEvents',studentAuth,function(req,res){
    let today = moment(new Date()).format('YYYY-MM-DD');
    today = today + "T00:00:00.000Z";
    Events.find({ start_date:{"$lte":new Date(today)} , end_date:{"$gte":new Date(today)} })
        .then((docs) => {
            res.status(200).send({ events: docs });
        })
        .catch((err) => {
            res.status(403).send({ "message": err });
        }); 
});

router.get('/pastEvents',studentAuth,function(req,res){
    let today = moment(new Date()).format('YYYY-MM-DD');
    today = today + "T00:00:00.000Z";
    Events.find({ end_date: { "$lte": new Date(today) } })
        .then((docs) => {
            res.status(200).send({ events: docs });
        })
        .catch((err) => {
            res.status(403).send({ "message": err });
        }); 
});


module.exports = router;