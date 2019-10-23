const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');
const routes = require('./routes');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/scripts',express.static(__dirname + '/views'));
app.use('/',routes);

app.all('*',function(req,res){
    res.render("NotFound404");
});


app.listen(3000,'localhost',function(){ 
    console.log("Server listening on port 3000");
}); 
