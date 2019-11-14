const express = require('express');
const router = express();
const moment = require('moment');
const Student = require('./student');
const Events = require('../events/event');
const Team = require('../teams/teams');
const Gallery = require('../image-gallery/image-gallery');
const VideoGallery = require('../video-gallery/video-gallery');
const Feedback = require('../feedback/feedback');
const studentAuth = require('../../middleware/studentauth');
const path = require('path');
const fs = require('fs');
const Club = require('../clubs/club');
const ObjectId = require('mongoose').Types.ObjectId;
const dateValidation = require('../../validations/dateValidation');

router.get('/login', function (req, res) {
    res.render("students/Login");
});

router.post('/goBack',function(req,res){
    console.log(req.headers);
    req.headers.authorization = 'Bearer ' + req.body.token;
    console.log(req.body);
    console.log(req.headers);
    res.redirect('/student/dashboard');
});

router.post('/giveFeedback',studentAuth,function(req,res){
    console.log(req.body);
    let obj = req.body;
    obj.regn_no = req.currentUser.regn_no;
    let data = new Feedback(obj);
    Feedback.create(data)
    .then((response)=>{
       return  res.send("Created");
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).send({"message":"Not Created"});
    })
});

router.get('/viewFeedback',studentAuth,function(req,res){
    Feedback.find({regn_no:req.currentUser.regn_no})
    .then((response)=>{
        return res.render("students/viewFeedback",{feeds:response})
    }).catch(err=>{
        console.log(err);
        return res.status(500).send({"message":err});
    });
});

router.get('/clubRatings/:clubId',studentAuth,function(req,res){
    Feedback.aggregate([
        {
            "$lookup":{
               from:'events',
               localField:'event_id',
               foreignField:'_id',
               as:'response' 
            }
        },
        {
            "$match":{
                'response.club_id':ObjectId(req.params.clubId)
            }
        }
       
    ]).exec(function(err,result){
        if(err)
            return res.status(500).send(err);
        return res.render("students/viewClubRatings",{ratings:result});
    });
});
router.get('/myCertificates',studentAuth,function(req,res){
    Team.find({"$or":[{
        "owner_name.regn_no":req.currentUser.regn_no},
        {"participants.regn_no":req.currentUser.regn_no}
    ]},
    {
        certificates:1
    })
    .then(response=>{
        // return res.send(response);
           return res.status(200).render("students/allCertificates",{certificates:response});
    })
    .catch(err=>{
        console.log(err);
        return res.status(500).send({"message":err});
    });
});

router.get('/myCertificates/:certId',studentAuth,function(req,res){
    Team.find({
        "$or": [{
            "owner_name.regn_no": req.currentUser.regn_no
        },
        { "participants.regn_no": req.currentUser.regn_no }
        ], "certificates._id": ObjectId(req.params.certId) }, { "certificates.$": 1 })
        .then((docs) => {
            if (docs) {
                // return res.send({val:docs});
                // console.log(docs[0].certificates);
                // return res.sendFile('event-certificates/' + docs[0].certificates[0].src, {root:__dirname})
                var data = fs.readFileSync(docs[0].certificates[0].src);
                res.contentType('application/pdf');
                return res.send(data);
            }
            return res.status(404).send({ "message": "File Not Found" });
        })
        .catch((err) => {
            console.log(err);
            return res.status(403).send({ "message": "No Such certificate" });
        });
});

router.get('/dashboard',studentAuth,function(req,res){
    Student.findOne({username:req.currentUser.username},{password:0})
    .then((user)=>{
        return res.render("students/dashboard",{auth:req.currentUser.token,id:user});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":err});
    })
})

router.get('/signup', function (req, res) {
    res.render("students/sign-up");
});

router.get('/clubs',studentAuth,function(req,res){
    Club.find({},{password:0})
    .then((clubs)=>{
        return res.render("students/viewAllClubs",{clubs:clubs});
        return res.send(clubs);
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":"Error Occured"});
    });
});

router.get('/clubs/eventsOrganised/:clubId',studentAuth,function(req,res){
    Events.find({club_id:req.params.clubId})
    .then((events)=>{
        return res.status(200).render("students/clubOrgEvents",{events:events});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(500).send({"message":"Some Error Occured"});
    })
});

router.get('/whichEvent/:catId',studentAuth,function(req,res){
    Events.findOne({"categories._id":req.params.catId},{"categories.$":1,event_name:1})
    .then((response)=>{
        if(!response)
            return res.status(500).send({ "message": "not found" });
        let arr = [];
        arr.push(response.event_name);
        arr.push(response.categories[0].category_name);
        return res.send(arr);
    })
    .catch((err)=>{
        console.log(err);
        return res.status(500).send({"message":err});
    })
});


router.get('/clubs/:clubId',studentAuth,function(req,res){
    Club.findOne({_id:req.params.clubId},{password:0})
    .then((club)=>{
        return res.status(200).render("clubs/profile",{profile:club});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(401).send({"message":err});
    })
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
                    res.status(201).send({ "message": "Success" });
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
                            Student.findOneAndUpdate({ username: req.body.username }, { "$push": { activeTokens: token } }, (err, students) => {
                                if (err) {
                                    console.log(err);
                                    return res.render("students/Login",{ "message": "Error Logging In" });
                                }
                            });
                            return res.render("students/dashboard", { auth: token, id: user });
                        }
                    });
                }
                else {
                    return res.render("students/Login",{"message":"Login Failed - Wrong Username/Password"});
                }
            });

        }
        else {
            return res.render("students/Login", { "message": "Login Failed - Wrong Username/Password" });
        }
    }).catch(err => {
        console.log(err);
        return res.render("students/Login", { "message": "Login Failed - Wrong Username/Password" });
    });
});

router.post('/signout',studentAuth,function(req,response){
    //console.log(tok);
    Student.findOneAndUpdate({username:req.currentUser.username},{"$pull":{activeTokens:req.currentUser.token}},(err,res)=>{
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

router.get('/myTeams',studentAuth,function(req,res){
    var teams = [];
    Team.find({ "$or": [{ "owner_name.regn_no": req.currentUser.regn_no, isDeleted: false },
     { "participants.regn_no": req.currentUser.regn_no}] }, { team_name:1 })
        .then((docs) => {
            // console.log(docs);
            teams = [...docs];           
                return res.render("students/myTeams", { allTeams: teams });
                //return res.send(teams);
        })
        .catch((err) => {
            console.log(err);
            return res.status(401).send({ "message": "Failed to Team Details" });

        }); 
});

router.get('/notifications', studentAuth, function (req, res) {
    Student.findOne({regn_no:req.currentUser.regn_no}, { notifications: 1 })
        .then((notifications) => {
            res.status(200).send({ notifications: notifications });
        })
        .catch((err) => {
            res.status(403).send({ "message": "error fetching notifications" });
        })
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
                    //console.log(succ);
                    return res.status(200).send({ "message": "Team successfully created "});
                })
                .catch(fail => {
                    console.log("Student Document Id Addition Failed for " + req.currentUser.regn_no + " " + fail);
                    return res.status(401).send({ "message": "Team Id Addition in Student Document Failed" });
                });
           // return res.status(200).send({ "message": "Team Successfully Created" });
        }
    });
}); 

//Adds a new member to the team
router.post('/teams/:id/addMember', studentAuth, function (req, res) {
    //console.log(req.body.data);
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
    //console.log("entered");
    Team.findOne({_id:req.params.teamId,isFinal:true,"owner_name.regn_no":req.currentUser.regn_no},(err,teams)=>{
        if(err) {
            console.log("Error:" + err);
            return res.status(401).send({"message":"Error Occured in Registration"});
        }
        if(!teams)
        {
            console.log("No Team Found!");
            return res.status(401).send({"message":"Team Id is wrong or you are not owner of the Team"});
        }
        else
        {
            Events.findOne({"categories._id":req.params.categoryId},{"categories.$":1,"reg_deadline":1,"event_name":1},(err,events)=>{
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
                   // console.log(events.reg_deadline);
                    if(dateValidation.after(new Date(),events.reg_deadline))
                        {
                            //console.log("Not Over");
                            return res.status(401).send({"message":"Event Registration Deadline Over"});
                        }
                    if ((teams.participants.length + 1) === (events.categories[0].group_size) && !teams.events_participated.find(function (value) {
                        return value.cat_id == req.params.categoryId;
                    }))
                    {
                       //console.log( );
                        teams.events_participated.push({cat_id:req.params.categoryId,event_id:events._id});
                        teams.save((err,succ)=>{
                            if(err){
                                console.log("Save error" + err);
                            }
                            else{
                                // console.log(succ);
                                let registrationNos = [teams.owner_name.regn_no];
                                for(var i=0;i<teams.participants.length;++i)
                                {
                                    registrationNos.push(teams.participants[i].regn_no);
                                }
                                let notification = {
                                    heading:"Event Registered",
                                    text: events.event_name + "/"+events.categories[0].category_name
                                }
                                Student.updateMany({regn_no:{$in:registrationNos}},{"$push":{notifications:notification}})
                                .catch((err)=>{
                                    console.log(err);
                                })
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
    Events.findOne({"categories._id":req.params.categoryId},{"categories.$":1,"reg_deadline":1})
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
                        if(index == -1)
                        {
                            return res.status(403).send({ "message": "Unauthorized Request or You are Not registered" });
                        }
                        if (team.events_participated[index].payment_status === 'Not Paid') {
                            team.events_participated.splice(index, 1);
                            team.save((err, success) => {
                                if (!err)
                                    return res.status(200).send({ "message": "Deregister Successfull" });
                            });
                        }
                        else {
                           return res.status(403).send({ "message": "You cannot deregister as you have already paid" });
                        }
                    }
                    else {
                        return res.status(403).send({ "message": "Unauthorized Request or You are Not registered" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(403).send({ "message": "Deregistration Unsuccessful" });
                });
            else
                return res.status(403).send({"message":"Deadline Passed"});

        }
        else
        {
            return res.status(401).send({"message":"No such category"});
        }
    })
    .catch((err)=>{
        console.log(err);
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
            return res.render("students/showOwnTeams",{teams:teams,selectCat:req.params.categoryId});
                // return res.send({ teams: teams });
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

router.get('/:teamId/eventNames',studentAuth,function(req,res){
    Team.findOne({_id:req.params.teamId},{_id:0,"events_participated.cat_id":1})
    .then((docs)=>{
        var eventArray = [];
        docs.events_participated.forEach(function(d){
            eventArray.push(d.cat_id);
        });
        Events.find({"categories._id":{"$in":eventArray}},{"categories.$":1,event_name:1})
        .then((response)=>{
            // res.send(response);
            return res.render("students/studentFeedback",{events:response})
        })
        .catch(err=>{
            console.log(err);
            return res.status(500).send({ "message": err });
        })
    })
    .catch((err)=>{
        console.log(err);
        return res.status(500).send({"message":err});
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
            return res.status(200).render("students/showParticipatedEvents",{events:result[0].participation,events_participated:result[0].events_participated})
        }
    });
    // Team.findOne({_id:req.params.teamId},{team_name:1,events_participated:1})
    // .then((response)=>{
    //     if(!response)
    //     {
    //         return res.status(401).send({"message":"Not participated in any such event"});
    //     }
    //     else{
    //         let obj = [];
    //         for(var i=0;i<response.events_participated.length;++i)
    //         {
    //             obj.push(response.events_participated[i].cat_id);
    //         }
    //         Events.find({"categories._id":{"$in":obj}},{"categories.$":1,event_name:1})
    //         .then((events)=>{
    //             for(var j=0;j<events.length;++j)
    //             {
    //                 var temp = response.events_participated.find(function(value){
    //                     console.log(value.cat_id + '-' + events[j].categories[0]._id);
    //                     return value._id != events[j].categories[0]._id;
    //                 });
    //                 if(!temp)
    //                 {
    //                     console.log(temp);
    //                 }
    //                 else
    //                 {
    //                     //console.log(temp);
    //                     events[j].payment_status = temp.payment_status;
    //                 }
    //             }
    //             return res.status(200).send(events);
    //         })
    //         .catch((err)=>{
    //             console.log(err);
    //             return res.status(500).send({"message":err});
    //         })
    //     }

    // })
    // .catch((err)=>{
    //     console.log(err);
    //     return res.status(500).send({"message":err});
    // });
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
    Events.find({start_date:{"$gt":new Date(today)}})
    .then((docs)=>{
        res.render("students/upcomingEvents",{events:docs});
    })
    .catch((err)=>{
        res.status(403).send({"message":err});
    });    
});

router.get('/showEvent/:eventId',studentAuth,function(req,res){
    Events.findOne({_id:req.params.eventId},{"categories":1,event_name:1})
    .then((events)=>{
        return res.render("students/showCategories",{event:events});
    })
    .catch((err)=>{
        return res.status(500).send({"message":err});
    })
});


router.get('/liveEvents',studentAuth,function(req,res){
    let today = moment(new Date()).format('YYYY-MM-DD');
    today = today + "T00:00:00.000Z";
    Events.find({ start_date:{"$lte":new Date(today)} , end_date:{"$gte":new Date(today)} })
        .then((docs) => {
            res.render("students/currentEvents",{ events: docs });
        })
        .catch((err) => {
            res.status(403).send({ "message": err });
        }); 
});

router.get('/pastEvents',studentAuth,function(req,res){
    let today = moment(new Date()).format('YYYY-MM-DD');
    today = today + "T00:00:00.000Z";
    Events.find({ end_date: { "$lt": new Date(today) } })
        .then((docs) => {
            res.render("students/pastEvents",{ events: docs });
        })
        .catch((err) => {
            res.status(403).send({ "message": err });
        }); 
});

router.get('/profile',studentAuth,function(req,res){
    Student
    .aggregate([
        {
            "$match":{regn_no:req.currentUser.regn_no}
        },
        {
            "$lookup":{
                from:'teams',
                localField:'myTeams',
                foreignField:'_id',
                as:'owned_teams'

            }
        }
    ])
    .exec(function(err,result){
        if(err)
            return res.status(401).send({"message":err});
        else
            return res.render("students/profile",{profile:result});
    })
}); 

router.get('/images/all',studentAuth,function(req,res){
    Events.find({})
    .then((events)=>{
        return res.render("students/imageGallery",{events:events});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":"Error Occured"});
    });
});

router.post('/images/:eventId/getImage',studentAuth,function(req,res){
    //console.log("enter");
    //console.log(req.body);
    //console.log(req.body.params);
    Gallery.findOne({event_id:req.params.eventId,"image_links.image_src":req.body.data},{"image_links.$":1})
    .then((images)=>{
        if(!images)
        {
            return res.status(403).send({"message":"Error occured"});
        }
        var ext = path.extname(images.image_links[0].image_src);
      //  console.log("Ext: " + ext);
        fs.readFile(images.image_links[0].image_src, 'base64', (err, image) => {
            const dataURL = '<div class="card"><div class="image"><img src="data:image/' + ext.toLowerCase().split('.')[1] + ';base64, ' + image
                + '" alt="Image Loading" ></div><div class="content"><a class="header">' + images.image_links[0].caption + "</a></div></div>";

            //console.log(dataURL);
           return res.status(200).send(dataURL);
            //return res.status(200).send( dataURL);

        });
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":"Error Occured"});
    })
});

router.get('/images/:eventId/all',studentAuth,function(req,res){
    //console.log(req.params.eventId);
    Gallery.findOne({event_id:req.params.eventId})
    .then((images)=>{
        return res.render("students/studentImages",{imageList:images});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":"Error Occured"});
    });
});

router.get('/videos/galleryPage',studentAuth,function(req,res){
    Events.find({},{_id:1,event_name:1})
    .then((events)=>{
        return res.render("students/studentVideoGallery", { events: events });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send({ "message": "Some Error Occured" });
        })
});


router.get('/videos/:eventId/all', studentAuth, function (req, res) {
    Events.findOne({ _id: req.params.eventId}, { video_links: 1 })
        .then((docs) => {
            if (!docs) {
                return res.status(403).send({ "message": "Error Occured" });
            }
            else {
                VideoGallery.findOne({ event_id: req.params.eventId })
                    .then((videos) => {
                        return res.status(200).render("students/studentVideos", { videoList: videos });
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).send({ "message": "error" });
                    })
            }
        }).catch((err) => {
            return res.status(404).send({ "message": "error" });
        })
});


module.exports = router;