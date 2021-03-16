const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const upload = require('express-fileupload');
const fs        = require('fs');
const { exec }  = require('child_process');


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

function getJwtToken(cookie) {
    /* Extract JWT Token from the Request.Headers.Cookie

       The jwt-token is embedded in the cookie header.
       * (Sample Cookie Header: SLG_GWPT_Show_Hide_tmp=undefined; SLG_wptGlobTipTmp=undefined; SLG_G_WPT_TO=es; username-localhost-8888="2|1:0|10:1613465254|23:username-localhost-8888|44:OTY5YmQ3MTdlZTQ0NDY4NGJlZTQ2NWM2ZWJkNGJkZGE=|b258da6947cc1c4517c931175964282a82847be53656475ad02b54b019fd0967"; jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE1NjMwMzIxLCJleHAiOjE2MjM0MDYzMjF9.gmwFehgujTVN04s4UyZBlM6hFbr6qFgkGSi2GuYZ-QM)
       * We can parse this cookie header by first, split('; ').
       * Then find the jwt_token by iterating over each cookie parameter

       Args:
           Requires - cookie (str) - the cookie string from request.headers
       Returns:
           NodeJS string
    */
    var token = '';
    cookies = cookie.split('; ');
    for (const index in cookies) {
        if (cookies[index].includes('jwt=')) {
            token = cookies[index].split('jwt=')[1];
        }

    }
    console.log('token = ' + token);
    return token;
}

function getJwtData(jwt_token) {
    /* Decode JWT encoded data from jwt_token
       Args:
           Requires - jwt_token (str) - the jwt_token string (hint: extacted from the cookies)
       Returns:
           NodeJS Object
    */
    return jwt.verify(jwt_token, process.env.JWT_SECRET, function(err, jwt_data) {
        return jwt_data;
    });
}

function getUserInfo(jwt_data, callback) {
    /* Get the user information from the USERS database using the jwt token encoded id

       Args:
           Requires - jwt_token (str) - the jwt_token string (hint: extacted from the cookies)
       Returns:
           callback(NodeJS Object)
    */
    var user_data = {};
    db.query('SELECT * FROM users WHERE id = ?', [jwt_data.id], async(error, results) => {

        return callback(results[0]);
    });
    // const results = db.query('SELECT * FROM users WHERE id = ?', [jwt_data.id]);
    // return results[0];
    // query.on('result', function(row) {
    //     //console.table(results[0]);
    //     callback(null, row);
    //     // return callback(results[0]);
    // });

    // db.query('SELECT * FROM users WHERE id = ?', [jwt_data.id], async(error, results) => {
    //     var user_data = {
    //         name: results[0].name,
    //         email: results[0].email,
    //         id: results[0].id
    //     };
    //     // user_data["name"] = results[0]["name"];
    //     // user_data["email"] = results[0]["email"];
    //     // user_data["id"] = results[0]["id"];
    //     console.log('in db.query()');
    //     console.table(user_data);
    //     return user_data;
    // });
}

exports.index = (req,res) => {
    console.log('\nin index...');
    // passed jwt token
    var jwt_token = getJwtToken(req.headers.cookie);
    var jwt_data = getJwtData(jwt_token);

    db.query('SELECT * FROM users WHERE id = ?', [jwt_data.id], async(error, results) => {
        var user_data = results[0];
        console.table(user_data);
        return res.render('index', {profile_name: user_data.name});
    });

    console.table(jwt_data);
    // getUserInfo(jwt_data, function(data) {
    //     console.table(data);
    //     user_data = data;
    //     return data;
    // });
    // // console.log('jwt-token = ' + jwt_token);
    // console.log(req);
    // return res.render('index', {
    //     profile_name: "TEST PROFILE"
    // });
};

exports.register = (req,res) => {
    return res.render('register');
};

exports.login = (req,res) => {
    return res.render('login');
};

exports.Messages = (req,res) => {
    return res.render('Messages');
};

exports.news = (req,res) => {
    return res.render('news');
};

exports.AccountSettings = (req,res) => {
    return res.render('AccountSettings');
};

exports.MyCreations = (req,res) => {
    return res.render('MyCreations');
};

exports.landingpage = (req, res) => {
    return res.render('landingpage');
};

exports.Upload = (req, res) => {
    console.log('Uploading...');
    console.log(req.file);
    if (req.files){
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);

        file.mv('./uploads/'+filename,function (err){
            if (err){
                return res.send(err);
            } else{
                return res.send("File Uploaded");
            }
        });
    }
};



exports.video = (req, res) => {
    const assets = 'uploads';
    const videName = 'movie';

    const path = `${assets}/${videName}.mp4`;

    fs.stat(path, (err, stat) => {

        // Handle file not found
        if (err !== null && err.code === 'ENOENT') {
            console.log('FILE NOT FOUND...');
            res.sendStatus(404);
        }

        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {

            const parts = range.replace(/bytes=/, "").split("-");

            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;

            const chunksize = (end-start)+1;
            const file = fs.createReadStream(path, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(206, head);
            return file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }

            res.writeHead(200, head);
            return fs.createReadStream(path).pipe(res);
        }
    });
};
