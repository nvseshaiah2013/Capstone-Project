const express = require('express');
const router = express();
const Student = require('./student');
const Events = require('../events/event');
const studentAuth = require('../../middleware/studentauth');

router.get('/login', function (req, res) {
    res.render("students/Login");
});

router.get('/signup', function (req, res) {
    res.render("students/sign-up");
});

router.post('/signup', function (req, res) {
    console.log(req.body);
    let student = new Student({
        username: req.body.username,
        password: req.body.password,
        regn_no: req.body.reg_no,
        name: req.body.name,
        phone_no: req.body.phone_no
    });
    Student.findOne({ regn_no: req.body.reg_no }).then(user => {
        if (user) {
            console.log("User Already Exists " + req.body.reg_no);
            res.status(401).json({ "message": "Registration No Already Used" });
            res.end();
        }
        else {
            Student.findOne({ username: req.body.username }).then(user => {
                if (user) {
                    console.log("Email Id already Taken " + req.body.reg_no);
                    res.status(401).json({ "message": "Email Id already Exists" });
                    res.end();
                }
                else {
                    student.save();
                    console.log(student + " Inserted\n");
                    res.status(200).send({ "message": "Success" });
                }
            }).catch(err => {
                console.log("Error: " + err);
            })
        }

    }).catch(err => {
        console.log("error occured");
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
        
        res.status(200).send({events:docs});
    }).catch(err=>{
        res.status(404).send({"message":"Error"});
    })
});

module.exports = router;