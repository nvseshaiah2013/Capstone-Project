const express = require('express');
const router = express();
const Student = require('./student');
const Events = require('../events/event');
const Team = require('../teams/teams');
const studentAuth = require('../../middleware/studentauth');

router.get('/login', function (req, res) {
    res.render("students/Login");
});

router.get('/signup', function (req, res) {
    res.render("students/sign-up");
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
                    res.send("Login Failed");
                }
            });

        }
        else {
            res.status(403).send("Invalid Credentials!");
        }
    }).catch(err => {
        res.status(403).send({ "message": "invalid Credentials" });
    });
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


//Adds a new member to the team
router.post('/teams/:id/addMember', studentAuth, function (req, res) {
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

//Creates a new Team
router.post('/teams',studentAuth,function(req,res){
    if(!req.body.data) return res.status(401).send({"message":"No Data Received"});
    let team = new Team({
        "owner_name.regn_no": req.currentUser.regn_no,
        "team_name": req.body.data.team_name,
        "owner_name.name": req.currentUser.name,
    });
    team.save((err,docs)=>{
        if(err){
            console.log(err);
            return res.status(401).send({"message":"Team Creation Unsuccessful"});
        }
        else    
            {
                Student.findOneAndUpdate({regn_no:req.currentUser.regn_no},{"$push":{myTeams:docs._id}})
                .then(succ=>{

                })
                .catch(fail=>{
                    console.log("Student Document Id Addition Failed for " + req.currentUser.regn_no + " " + fail);
                    return res.status(401).send({"message":"Team Id Addition in Student Document Failed"});
                });
                return res.status(200).send({"message":"Team Successfully Created"});
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

module.exports = router;