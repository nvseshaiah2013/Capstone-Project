const express = require('express');
const router = express();
const Club = require('./club');
const Event = require('../events/event');
const clubAuth = require('../../middleware/clubauth');
const adminAuth = require('../../middleware/adminauth');
const Team = require('../teams/teams');

router.get('/add',function(req,res){
    res.render("clubs/clubNew");
});

router.post('/add',function(req,res){ 
    let club = new Club({
        "name":req.body.data.club_name,
        "username":req.body.data.username,
        "password":req.body.data.password,
        "desc.found_date":req.body.data.found_date,
        "desc.founders":req.body.data.founders,
        "desc.ceo":req.body.data.ceo,
        "contact.phone_no":req.body.data.phone_no,
        "contact.email_id":req.body.data.email_id,
        "contact.address":req.body.data.address
    });
    Club.findOne({name:req.body.data.club_name}).then(succ=>{
        if(!succ)
        {
            Club.findOne({username:req.body.data.username}).then(suc=>{
                if(!suc)
                {
                    club.save();
                    console.log("Saved");
                    return  res.statusCode(200).send({"message":"save Success!"}).end();
                }
                else
                {
                    console.log("username already in use");
                
                  return  res.statusCode(401).send({"message":"username already in use"}).end();
                }

            }).catch(err=>{
             // return  res.status(401).send({"message":"Error Occured" + err}).end();
            });
        }
        else
        {
            console.log("Name Exists");
           return res.statusCode(401).send({"message":"Club Name Already Exists"}).end();
        }

    }).catch(err=>{
        console.log(err);
       return res.statusCode(403).send({"message":"Something wrong","error":err}).end();
    })
    return res.send("Successfully Reached End!").end();
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

router.get('/events',clubAuth,function(req,res){
    Event.find({club_id:req.currentUser._id})
    .then((docs)=>{
        return res.render("events/allClubEvents",{events:docs});
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({"message":"Club Does Not Exist"});
    });
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

router.get('/events/:eventId/addCategory',clubAuth,function(req,res){
    Event.findOne({_id:req.params.eventId,club_id:req.currentUser._id})
    .then((docs)=>{
        if(docs)
        {
            return res.render("events/addCategory",{event:docs});
        }
        else
            {
                return res.status(403).send({"message":"No Such Event"});
            }
    })
    .catch((err)=>{
        console.log(err);
        return res.status(403).send({ "message": "No Such Event" });
    });
});

router.post('/events/:eventId/addCategory',clubAuth,function(req,res){
    Event.findByIdAndUpdate(req.params.eventId,{"$push":{categories:req.body.data.category}},{new:true},function(err,docs){
        if(err)
        {
            console.log(err);
            return res.status(403).send({"message":"Failed to Add a New Category. Try Again"});
        }
        else{
            if(docs)
            {
                return res.status(200).send({"message":"Success"});
            }
            else
            {
                return res.status(403).send({"message":"No Such Event Exists"});
            }

        }
    });
});

module.exports = router;