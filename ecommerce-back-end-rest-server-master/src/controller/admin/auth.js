require("dotenv").config()
const Admin = require("../../models/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const twilio = require("twilio");
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

let adminData;
exports.getOTP = async (req, res) => {

  const existingUser = await Admin.findOne({ phone: req.body.phone })

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
          adminData = {
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
        const _admin = new Admin(adminData);

        _admin.save();
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
  Admin.findOne({ phone: req.body.phone }).exec(async (error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      const isPassword = await user.authenticate(req.body.password);
      if (isPassword) {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          "myJWTssecRet",
          { expiresIn: "1d" }
        );
        const { _id, name, email, phone } = user;
        res.cookie("token", token, { expiresIn: "1d" });
        res.status(200).json({
          token,
          user: { _id, name, phone, email },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successfully...!",
  });
};
