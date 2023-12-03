const express = require('express');
const authenticationController = require('../controllers/authentication');


const router = express.Router();

router.post('/login', authenticationController.login);
router.post('/logout', authenticationController.logout);
router.get('/me', authenticationController.me);

module.exports = router;
