const express = require('express');
const { signin, getOTP, verifyOTP } = require('../controller/auth');
const { isRequestValidated, validateSigninRequest, validateOtpRequest, validateVerifyRequest } = require('../validators/auth');
const router = express.Router();


router.post('/getOTP', validateOtpRequest, isRequestValidated, getOTP);
router.post('/verifyOTP', validateVerifyRequest, isRequestValidated, verifyOTP);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);


// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

module.exports = router;