const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload');

dotenv.config({
    path: './.env'
})

const app = express();


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({
    extended: false
}));

app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');



db.connect(function(err){
    if (err) {
        console.log('DB Error');
        throw err;
        return false;
    }
});

app.use(upload());

/* TEDDY EDIT: using pagesController (modeled after authController) */
// app.use('/', require('./routes/pages'));



app.use('/', require('./routes/pages'));

app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log("Server started on port 3000");
})
