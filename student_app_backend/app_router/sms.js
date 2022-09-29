const express = require("express");
const router = express.Router();
const user = require("../app_models/user");
const referalFunction = require("../common/referaladdmony");
// const referal = require("../app_models/referal");
const transection = require("../app_models/transection");
const wallet = require("../app_models/wallet");
const key = require("../config/config.js").paymentKey;
const request = require("request");
const axios = require("axios");
const moment = require("moment");
const https = require("https");
const urlencode = require("urlencode");
const saltRounds = 10;
const { uniqueId } = require("../common/uniqueId");

router.post("/newuserotp", async (req, res) => {
  console.log("data ", req.body.query);
  let body = req.body.query;
  user.findOne({ phone: req.body.query.phone }).then((data) => {
    console.log(data);
    if (data == null) {
      let preparedata = {
        name: body.username,
        phone: body.phone,
        role_id: body.role_id,
        otp: uniqueId(6),
        modified_on: new Date(),
      };
      console.log("aprepardate", preparedata);
      let inser = new user(preparedata);
      let data = inser.save().then((data) => {
        let name = data.name;
        let otp = data.otp;
        var msg = urlencode(
          `Dear ${name}
           Your verification code for Account Activation is ${otp}. Please do not share this to anyone unless you not initiate. VS Enterprises`
        );
        var number = data.phone;
        var apikey = "NTQzMDM1NDQzODQ0Nzc3NzU0NmI3NTU3NDUzOTY0NTI=";
        console.log("message ", msg);
        var sender = "VSEMSG";
        var data =
          "apikey=" +
          apikey +
          "&sender=" +
          sender +
          "&numbers=" +
          number +
          "&message=" +
          msg;
        var options = {
          host: "api.textlocal.in",
          path: "/send?" + data,
        };
        callback = function (response) {
          var str = "";
          //another chunk of data has been recieved, so append it to `str`
          response.on("data", function (chunk) {
            str += chunk;
          });
          //the whole response has been received, so we just print it out here
          response.on("end", function () {
            console.log(str);
          });
        };
        // console.log('hello js'))
        https.request(options, callback).end();
        //url encode instalation need to use $ npm install urlencode
        res.json({
          success: false,
          statuscode: 200,
          status: "otp generated successfully",
        });
      });
    } else {
      res.json({
        success: false,
        statuscode: 400,
        status: "This number already register with us",
      });
    }
  });
});

router.post("/excitingUserotp", async (req, res) => {
  user
    .findOneAndUpdate(
      { phone: req.body.query.phone },
      { otp: uniqueId(6) },
      { new: true }
    )
    .then((data) => {
      if (data !== null) {
        console.log("data", data);
        let name = data.name;
        let otp = data.otp;
        var msg = urlencode(
          `Dear ${name}
Your verification code for Account Activation is ${otp}. Please do not share this to anyone unless you not initiate. VS Enterprises`
        );
        var number = data.phone;
        var apikey = "NTQzMDM1NDQzODQ0Nzc3NzU0NmI3NTU3NDUzOTY0NTI=";
        console.log("message ", msg);
        var sender = "VSEMSG";
        var data =
          "apikey=" +
          apikey +
          "&sender=" +
          sender +
          "&numbers=" +
          number +
          "&message=" +
          msg;
        var options = {
          host: "api.textlocal.in",
          path: "/send?" + data,
        };
        callback = function (response) {
          var str = "";
          //another chunk of data has been recieved, so append it to `str`
          response.on("data", function (chunk) {
            str += chunk;
          });
          //the whole response has been received, so we just print it out here
          response.on("end", function () {
            console.log(str);
          });
        };
        // console.log('hello js'))
        https.request(options, callback).end();
        // url encode instalation need to use $ npm install urlencode
      } else {
        res.json({
          success: false,
          statuscode: 400,
          status: "Accoount not excite with us ",
        });
      }
    })
    .catch((data) => {
      console.log("sdkjdk", data);
    });
});

module.exports = router;
