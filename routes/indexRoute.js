const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoute');
const dashboard = require('./dashboardRoute')

router.use('/', authRoutes)
router.use('/', dashboard)



module.exports = router