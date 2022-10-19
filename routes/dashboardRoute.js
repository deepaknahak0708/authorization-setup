const express = require('express');
const router = express.Router();
const {dashboard} = require('../controller/dashboardController');
const { authorised,notAuthorised} = require('../middleware/authManager')

router.get('/dashboard', authorised,dashboard)

module.exports = router 