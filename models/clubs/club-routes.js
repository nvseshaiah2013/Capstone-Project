const express = require('express');
const router = express();
const Club = require('./club');
const Event = require('../events/event');
const clubAuth = require('../../middleware/clubauth');
const adminAuth = require('../../middleware/adminauth');

router.get('/add',function(req,res){
    res.render("clubs/clubNew");
});

router.post('/add',function(req,res){ 
    let club = new Club({
        "name":req.body.club_name,
        "username":req.body.username,
        "password":req.body.password,
        "desc.found_date":req.body.found_date,
        "desc.founders":req.body.founders,
        "desc.ceo":req.body.ceo,
        "contact.phone_no":req.body.phone_no,
        "contact.email_id":req.body.email_id,
        "contact.address":req.body.address
    });
    Club.findOne({name:req.body.club_name}).then(succ=>{
        if(!succ)
        {
            Club.findOne({username:req.body.username}).then(suc=>{
                if(!suc)
                {
                    club.save();
                    console.log("Saved");
                    res.status(200).json({"message":"save Success!"})
                }
                else
                {
                    console.log("username already in use");
                
                    //res.status(401).json({"message":"username already in use"});
                }

            }).catch(err=>{
                //res.status(401).json({"message":"Error Occured"})
            });
        }
        else
        {
            console.log("Name Exists");
           // res.status(401).json({"message":"Club Name Already Exists"});
        }

    }).catch(err=>{
        console.log(err);
       // res.status(403).json({"message":"Something wrong","error":err});
    })
    res.send("Successfully Reached End!");
});

router.get('/login',function(req,res){
    res.render("clubs/login");
});

router.post('/login',function(req,res){
    Club.findOne({username:req.body.username}).then(succ=>{
        if(succ)
        {
            succ.comparePwd(req.body.password,function(err,result){
                if(err) throw err;
                if(result){
                    succ.genJWT(function(err,token){
                        if(err) res.send("Some Problem Occured");
                        else res.status(200).render("clubs/dashboard",{auth:token,club:succ});
                    });
                }
                else{
                    res.status(401).json({"message":"Unauthorized"});
                }
            });
        }
    }).catch(err=>{
        res.status(401).json({"message":"Unuath"});
    });
});

router.get('/events',function(req,res){
    res.send("All Events");
});

router.get('/events/add',clubAuth,function(req,res){
    res.render("events/new-event");
});

router.post('/events',clubAuth,function(req,res){
    // console.log("Reached Here");
    // console.log(req.body.data);
    let data = req.body.data;
    let event = new Event({
        "event_name":data.event_name,
        "club_id":req.currentUser._id,
        "start_date":data.start_date,
        "end_date":data.end_date,
        "reg_deadline":data.reg_deadline,
        "description.venue":data.venue,
        "description.misc_details":data.misc_details,
        "description.prizes_worth":data.prizes_worth,
        "categories":data.categories
    });
    Event.create(event).then(suc=>{
        console.log(suc);
       // console.log("Event Save Success");
        return res.send({"message":"Event Added Successfully"});
    }).catch(err=>{
        console.log(err);
        return res.send({"message":"Event Addition Failed"});
    })
});

module.exports = router;