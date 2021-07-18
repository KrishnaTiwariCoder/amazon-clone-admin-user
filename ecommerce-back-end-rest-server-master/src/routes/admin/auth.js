const express = require('express');
const { signin, signout, getOTP, verifyOTP } = require('../../controller/admin/auth');
const { validateOtpRequest, isRequestValidated, validateSigninRequest, validateVerifyRequest } = require('../../validators/auth');
const { requireSignin } = require('../../common-middleware');

const router = express.Router();


router.post('/admin/getOTP', validateOtpRequest, isRequestValidated, getOTP);
router.post('/admin/verifyOTP', validateVerifyRequest, isRequestValidated, verifyOTP);
router.post('/admin/signin', validateSigninRequest, isRequestValidated, signin);
router.post('/admin/signout', signout)


module.exports = router;