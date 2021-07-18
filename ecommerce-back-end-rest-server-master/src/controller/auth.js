require("dotenv").config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const twilio = require("twilio")

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, 'myJWTssecRet', {
    expiresIn: "1d",
  });
};

let userData;
exports.getOTP = async (req, res) => {

  const existingUser = await User.findOne({ phone: req.body.phone })

  if (existingUser) {
    res.status(400).json({
      message: "Admin already registered"
    })
  } else {
    client
      .verify
      .services(process.env.SERVICE_ID)
      .verifications
      .create({
        to: `+${req.body.phone}`,
        channel: "sms"
      })
      .then(data => {
        if (data) {
          res.status(201).json({
            message: "Verification created ...!"
          })
          userData = {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password
          }
        }
      })
      .catch(error => {
        res.status(400).json({ error })
      })
  }

}
exports.verifyOTP = (req, res) => {
  client
    .verify
    .services(process.env.SERVICE_ID)
    .verificationChecks
    .create({
      to: `+${req.body.phone}`,
      code: req.body.code
    })
    .then(data => {
      if (data.status === "approved") {
        res.status(200).json({
          message: "user is verified :) "
        })
        const _user = new User(userData);

        _user.save();
      } else {
        res.status(400).json({
          message: "wrong code or already registered"
        })
      }
    })
    .catch(error => {
      res.status(400).json({
        message: "something went wrong :("
      })
    })
}


exports.signin = (req, res) => {
  User.findOne({ phone: req.body.phone }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword && user.role === "user") {
        // const token = jwt.sign(
        //   { _id: user._id, role: user.role },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1d" }
        // );
        const token = generateJwtToken(user._id, user.role);
        const { _id, name, email, role, phone } = user;
        res.status(200).json({
          token,
          user: { _id, phone, name, role, email },
        });
      } else {
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};
