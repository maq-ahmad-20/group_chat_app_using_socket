const express = require('express');
const loginControl = require('../controllers/login')

const router = express.Router();

router.post('/login', loginControl.postloginuser)




module.exports = router;