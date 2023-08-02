const express = require('express');
const userControl = require('../controllers/usersignup')

const router = express.Router();



router.post('/signup', userControl.postUser)



module.exports = router;