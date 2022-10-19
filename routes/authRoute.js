const express = require('express');
const router = express.Router();
const {
    getSignup, getLogin, signUp, login, logout, getForgetPassword, forgotPassword, resetPassword, resetPw, verifyOtp, signupOtpVerification
} = require('../controller/authController');
const validator = require('../middleware/validation');
const { authorised, notAuthorised } = require('../middleware/authManager');
const passport = require('passport');

router.get('/signup', notAuthorised, getSignup)
router.post('/signup', notAuthorised, validator('user'), signUp)


router.get('/login', notAuthorised, getLogin)
router.post('/login', notAuthorised, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}), login)
 

router.get('/logout', authorised, logout)

router.get('/verify-otp', verifyOtp)
router.post('/verify-otp', signupOtpVerification)


router.get('/forget-password', notAuthorised, getForgetPassword)
router.post('/forget-password', notAuthorised, forgotPassword)

router.get('/reset-password', notAuthorised, resetPassword)
router.post('/reset-password', notAuthorised, resetPw)


module.exports = router