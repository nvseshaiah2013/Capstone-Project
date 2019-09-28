const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/db');
const routes = require('./routes');
const axios = require('axios');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use('/',routes);


app.listen(3000,'localhost',function(){
    console.log("Server listening on port 3000");
}); 
