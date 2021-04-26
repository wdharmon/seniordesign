const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/Messages', authController.Messages);

router.post('/AccountSettings', authController.AccountSettings);

router.post('/news', authController.news);

router.post('/MyCreations', authController.MyCreations);

router.post('/landingpage', authController.landingpage);

router.post('/logout', authController.logout);

module.exports = router;