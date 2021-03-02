const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {
    res.render('index');
})

router.get('/register', (req,res) => {
    res.render('register');
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/Messages', (req,res) => {
    res.render('Messages');
});

router.get('/news', (req,res) => {
    res.render('news');
});

router.get('/AccountSettings', (req,res) => {
    res.render('AccountSettings');
});

router.get('/MyCreations', (req,res) => {
    res.render('MyCreations');
});


module.exports = router;