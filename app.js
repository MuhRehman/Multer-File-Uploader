const express = require('express');
const multer  = require('multer');
const ejs  = require('ejs');
const path = require('path');


// init app

const app = express();


const port = 3000;
 
app.listen(port, ()=> console.log(`Sever Started On port${port}`));