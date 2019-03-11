const express = require('express');

const bP = require('body-parser');
const path = require('path');
const app = express();

app.use(bP.json());
app.use(express.static(path.join( __dirname,'../public/dist/public' )));


require('./routes')(app);
app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("../public/dist/public/index.html"))
});

app.listen(8000);