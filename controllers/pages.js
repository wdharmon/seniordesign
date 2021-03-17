const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//const upload = require('express-fileupload');
const path      = require('path');
const fs        = require('fs');
const { exec }  = require('child_process');


const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

function getDateTime() {
    /* Custom Function to Generate the Current Date Time
       Format:
           YEAR_MONTH_DAY_HOUR_MIN_SEC
       Returns:
           NodeJS string - (example: 2021_03_16_08_22_01)
    */
    var date = new Date();

    var hour = date.getHours();
    var min  = date.getMinutes();
    var sec  = date.getSeconds();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day  = date.getDate();

    hour = (hour < 10 ? "0" : "") + hour;
    min = (min < 10 ? "0" : "") + min;
    sec = (sec < 10 ? "0" : "") + sec;
    month = (month < 10 ? "0" : "") + month;
    day = (day < 10 ? "0" : "") + day;

    return year + "_" + month + "_" + day + "_" + hour + "_" + min + "_" + sec;
}

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
    console.log('jwt-token = ' + token);
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

exports.index = (req,res) => {
    // passed jwt token
    if (req.headers.cookie) {
        var jwt_token = getJwtToken(req.headers.cookie);
        var jwt_data = getJwtData(jwt_token);

        console.table(jwt_data);
        db.query('SELECT * FROM users WHERE id = ?', [jwt_data.id], async(error, results) => {
            if (!results.length) {
                return res.render('index', { logged_in: false, profile_name: "BAD COOKIE" });
            } else {
                var user_data = results[0];
                console.table(user_data);

                db.query('SELECT * FROM videos;', async(error2, results2) => {
                    var videos = results2;
                    console.table(videos);

                    return res.render('index', {
                        logged_in: true,
                        profile_name: user_data.name,
                        video_list: videos
                    });
                });
            }
        });
    } else {
        return res.render('index', { logged_in: false, profile_name: "NOT LOGGED IN!" });
    }

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
    if (req.headers.cookie) {
        var jwt_token = getJwtToken(req.headers.cookie);
        var jwt_data = getJwtData(jwt_token);
        console.table(jwt_data);

        db.query('SELECT * FROM users WHERE id = ?', [jwt_data.id], async(error, results) => {
            var user_data = results[0];
            console.table(user_data);

            if (req.files) {
                console.log('Uploading...');
                console.log(req.files);
                var file = req.files.file;
                var file_ext = path.extname(file.name);
                var file_name = user_data.id + "_" + file.name.replace(file_ext, "_" + getDateTime() + file_ext);
                var thumbnail = file_name.replace(file_ext, '.jpg');

                file.mv('./uploads/'+file_name,function (err){
                    if (err){
                        return res.send(err);
                    } else{
                        db.query('INSERT INTO videos SET ?', {
                            filename: file_name, thumbnail: thumbnail, name: user_data.name, email: user_data.email, userid: user_data.id
                        }, (error, results2) => {
                            if (error){
                                console.log(error);
                            } else {
                                /* CREATE THUMBNAIL
                                   - IF THIS DOESN'T WORK, COMMENT OUT THE exec() statement AND UNCOMMENT //return res.sen("File Uploaded");
                                   - EVERYTHING EXCEPT: return res.send("File Uploaded");
                                */
                                exec(`bin/ffmpeg -i "uploads/${file_name}" -ss 00:00:02.00 -r 1 -an -vframes 1 -f mjpeg "public/thumbs/${thumbnail}"`, (error, stdout, stderr) => {
                                    if (error) { return; }
                                    console.table({
                                        video_file: `"uploads/${file_name}"`,
                                        video_thumb: `"public/thumbs/${thumbnail}"`
                                    });
                                    return res.send("File Uploaded");
                                });
                                //return res.sen("File Uploaded");
                            }
                        });
                    }
                });
            }
        });
    } else {
        return res.send("NOT LOGGED IN!");
    }
};



exports.video = (req, res) => {
    const assets = 'uploads';
    const videoName = decodeURIComponent(req.params.vname); //'SpongeBob SquarePants - S12E20 - The Ghost of Plankton.mp4';//''movie.mp4';
    const filePath = `${assets}/${videoName}`;
    console.log("video_stream: " + filePath);

    fs.stat(filePath, (err, stat) => {

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
            const file = fs.createReadStream(filePath, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            return file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(200, head);
            return fs.createReadStream(filePath).pipe(res);
        }
    });
};
