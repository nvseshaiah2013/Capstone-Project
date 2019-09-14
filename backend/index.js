const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');


const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use('/',routes);

app.listen(3000,'localhost',function(){
    console.log("Server listening on port 3000");
});