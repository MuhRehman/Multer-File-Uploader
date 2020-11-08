require('./models/db');

const express = require('express');
const path = require('path');
const crypto = require('crypto');
const exphbs = require('express-handlebars');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const port = process.env.PORT || 3000;

const employeeController = require('./controllers/employeeController');

var app = express();



// middleware
// app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine','ejs');


app.use(bodyparser.urlencoded({
    extended: true
}));


// mongo url
const mongoURI = 'mongodb+srv://rehman:rehman123@cluster0.s9oi5.mongodb.net/malter?retryWrites=true&w=majority';


// create a connection
const conn =  mongoose.createConnection(mongoURI);

// init gfs
let gfs;

conn.once('open', () =>  {
     gfs = Grid(conn.db, mongoose.mongo);
     gfs.collection('uploads');
 
  })


//   const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
//   });
//   const upload = multer({ storage });


// app.get('/', (req, res) => res.render('views/employee/index.ejs'));











// ----------------------------------Set Storage Engine--------
const  storage  = multer.diskStorage({
    destination: './public/uploads/',
    filename:function (req ,file , cb) {
         cb(null,file.fieldname  + '-' + Date.now() + 
         path.extname(file.originalname));
    }
}) 

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    // fileFilter:function ( req, file, cb) {
    //     checkFileType(file,cb);
    // }

}).single('myImage');



// Check File Type
function checkFileType(file , cb) {
    // alert('d');
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.minetype);

    if (mimetype && extname) {
        return cb(null,true);
    }else {
        cb('Error : images only');
    }
}




// ----------------------------------ejs--------

app.set('view  engine' , 'ejs');


// ----------------------------------ejs--------
// ----------------------------------static Folders--------

app.use(express.static('./public'));
// ----------------------------------static Folders--------

app.get('/', (req, res) => res.render('main/index.ejs'));

app.get('/add', (req, res) => res.render('views/employee/index.ejs'));


app.use(bodyparser.json());
app.set('views', path.join(__dirname, '/views/'));
// app.get('add', path.join(__dirname, '/views/addOrEdit'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');
// app.use( express.static( "public" ) );
app.use( express.static( "views" ) );

app.get('malter', (req, res) => {
    res.send('hello people');
});

app.post('/upload', (req, res) => {

    upload(req,res ,(err)=> {
        
        if(err){
            res.render('index.ejs',{
                msg : err
            });
        }else{
            if (req.file == undefined) {
                res.render('index.ejs',{
                    msg : "Error no file selected !"
                });
            }else {
                res.render('index.ejs',{
                    msg : "File Uploaded !",
                    file : `Uploads/${req.file.filename}`,
                 
                     
                });
                  
            }
        }
        
    });
});


app.listen(port, () => {
    console.log(`Express server started at port : ${port}`);
});

app.use('/employee', employeeController);