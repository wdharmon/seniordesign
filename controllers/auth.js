const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



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

exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) =>{
           // console.log(results);
            if(!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Email or Password is incorrect. Please check again.'
                })
            } else{
                const id = results[0].id;
                const token = jwt.sign({
                    id: id
                }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000
                    ),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");
            }
        } )
    } catch (error){
        console.log(eror);
    }
}

exports.register = (req, res) => {
    console.log(req.body);

    const {name, email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'Email is already in use'
            })
        } else if(password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
        });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword, create_time: getDateTime() }, (error,results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });

}

exports.AccountSettings = (req, res) => {
    console.log('test AccountSettings');
}

exports.Messages = (req, res) => {
    console.log('test Messages');

}

exports.news = (req, res) => {
    console.log('test news');

    
    }

exports.MyCreations = (req, res) => {
    console.log('test MyCreations');
    
    }

exports.landingpage = (req, res) => {
    console.log('test landingpage');
}
    
exports.logout = (req, res) => {
    console.log('test logout');
}
    