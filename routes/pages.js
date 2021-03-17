const express = require('express');

const pagesController = require('../controllers/pages');

const router = express.Router();

router.get('/', pagesController.index);

router.get('/register', pagesController.register);

router.get('/login', pagesController.login);

router.get('/Messages', pagesController.Messages);

router.get('/news', pagesController.news);

router.get('/AccountSettings', pagesController.AccountSettings);

router.get('/MyCreations', pagesController.MyCreations);

router.get('/landingpage', pagesController.landingpage);

router.get('/video/:vname', pagesController.video);

router.post('/', pagesController.Upload);


module.exports = router;
