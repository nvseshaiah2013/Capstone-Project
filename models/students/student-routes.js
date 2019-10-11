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
                        "owner_name.regn_no":req.body.data.reg_no,
                        "team_name":"Individual",
                        "owner_name.name":req.body.data.name,
                        "isFinal":true
                    });
                    team.save(function(err,doc){
                        if(err) console.log("Individual Team Creation Failed " + err);
                        else 
                            {
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

router.post('/login', function (req, res) {
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

router.get('/events',studentAuth,function(req,res){
    // console.log("reached event Route");
    Events.find({}).then(docs=>{        
        res.render("events/allEvents",{events:docs});
    }).catch(err=>{
        res.status(404).send({"message":"Error"});
    })
});

router.get('/teams',studentAuth,function(req,res){
    var teams = new Object();
    Team.find({"owner_name.regn_no":req.currentUser.regn_no,isDeleted:false},{isDeleted:0,date_created:0})
    .then((docs)=>{
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
                return res.status(401).send({"message":"Failed to load participant designation"});
            });
    })
    .catch((err)=>{
        console.log(err);
        return res.status(401).send({ "message": "Failed to Team Details" });

    });
      
});

module.exports = router;