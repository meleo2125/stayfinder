const express = require('express');
const router = express.Router();
const hostAuthController = require('../controllers/hostAuthController');

router.post('/register', hostAuthController.register);
router.post('/login', hostAuthController.login);
router.post('/logout', hostAuthController.logout);

module.exports = router; 