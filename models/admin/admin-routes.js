const express = require('express');
const router = express();
const Admin = require('./admin');


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

module.exports = router;