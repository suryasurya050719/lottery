const express = require("express");
const router = express.Router();
const user = require("../app_models/user");
const referal = require("../app_models/referal");
const winningReport = require("../app_models/winning_Revords");
const referralCodeGenerator = require("referral-code-generator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const numberFunction = require("../common/numberFunction");
const saltRounds = 10;

router.post("/lotteryResult", async (req, res) => {
  try {
    let prepareData = {};
    if (
      req.body.user_id !== "" ||
      req.body.user_id !== null ||
      req.body.user_id !== undefined
    ) {
      prepareData["user_id"] = req.body.user_id;
    }
    winningReport
      .aggregate([
        {
          $unwind: {
            path: "$wining_booking",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $and: [{ "wining_booking.user_id": prepareData.user_id }],
          },
        },
        {
          $sort: {
            created_on: -1,
          },
        },
      ])
      .then((data) => {
        console.log("dtaa", data);
        res.json({
          success: false,
          data: data,
          statuscode: 400,
          status: "list generated",
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          data: error,
          statuscode: 400,
          status: "list generated",
        });
      });
  } catch (error) {
    res.json({
      success: false,
      data: error,
      statuscode: 400,
      status: "list generated",
    });
  }
});

router.post("/winningResult", async (req, res) => {
  try {
    let prepareData = {};
    if (
      req.body.user_id !== "" ||
      req.body.user_id !== null ||
      req.body.user_id !== undefined
    ) {
      prepareData["user_id"] = req.body.user_id;
    }
    winningReport
      .aggregate([
        {
          $unwind: {
            path: "$wining_booking",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $and: [{ "wining_booking.user_id": prepareData.user_id }],
          },
        },
        {
          $sort: {
            created_on: -1,
          },
        },
      ])
      .then(async (data) => {
        console.log("data.length",data.length)
        if (data.length > 0) {
          let winningData = [];
          for (let i = 0; i < data.length ; i++) {
            console.log("i and length",i, data.length)
            const element = data[i];
            console.log("element",element)
            await element.wining_booking.booking_data.forEach(async(props) => {
                console.log("props",props)
              if (props.lottery_price !== 0) {
               await winningData.push(props);
              }
            });
            element.wining_booking["winning_data"] = await winningData;
            delete element.wining_booking.booking_data;
            if (data.length  == i+1) {
              res.json({
                success: true,
                data: data,
                statuscode: 400,
                status: "list generated",
              });
            }
          }
        } else {
          res.json({
            success: false,
            data: {},
            statuscode: 400,
            status: "No Data Found",
          });
        }
      })
      .catch((error) => {
        res.json({
          success: false,
          data: error,
          statuscode: 400,
          status: "list generated",
        });
      });
  } catch (error) {
    res.json({
      success: false,
      data: error,
      statuscode: 400,
      status: "list generated",
    });
  }
});

module.exports = router;
