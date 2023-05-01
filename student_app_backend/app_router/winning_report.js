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
    console.log("body",req.body)
    let prepareData = {};
    if (
      req.body.user_id !== "" ||
      req.body.user_id !== null ||
      req.body.user_id !== undefined
    ) {
      prepareData["user_id"] = req.body.user_id;
    }else{
      // console.log("dtaa", data);
      return res.json({
        success: false,
        data: {},
        statuscode: 400,
        status: "user id required",
      });
    }
    if (
      req.body.showTime 
    ) {
      console.log(">>>>")
      prepareData["show_date"] = req.body.showTime;
    }else{
      console.log("sdfsd")
      // console.log("dtaa", data);
      return res.json({
        success: false,
        data: {},
        statuscode: 400,
        status: "show time required",
      });
    }
    let query=[
      {
        $match:{
          show_details: new Date(req.body.showTime)
        }
      },
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
    ]
    console.log("query",query)
    winningReport
      .aggregate(query)
      .then((data) => {
        console.log("dtaa>>>>", data);
        res.json({
          success: true,
          data: data,
          statuscode: 200,
          status: "list generated",
        });
      })
      .catch((error) => {
        console.log("error",error)
        res.json({
          success: false,
          data: error,
          statuscode: 400,
          status: "list generated",
        });
      });
  } catch (error) {
    console.log("error",error)
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
        console.log("data.length", data.length);
        if (data.length > 0) {
          let winningData = [];
          for (let i = 0; i < data.length; i++) {
            console.log("i and length", i, data.length);
            const element = data[i];
            console.log("element", element);
            await element.wining_booking.booking_data.forEach(async (props) => {
              console.log("props", props);
              if (props.lottery_price !== 0) {
                await winningData.push(props);
              }
            });
            element.wining_booking["winning_data"] = await winningData;
            delete element.wining_booking.booking_data;
            if (data.length == i + 1) {
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
router.get("/AdminWinningResult", async (req, res) => {
  try {
    console.log("req.query", req.query);
    let prepareData = {};
    if (
      req.query.showTime !== "" ||
      req.query.showTime !== null ||
      req.query.showTime !== undefined
    ) {
      prepareData["show_date"] = new Date(req.query.showTime);
    } else {
      res.json({
        success: false,
        data: {},
        statuscode: 400,
        status: "required Show Time ",
      });
    }
    console.log(
      "fgdfg",
      { show_details: prepareData.show_date },
      {
        game_name: req.query.game_name,
      }
    );
    winningReport
      .aggregate([
        {
          $match: {
            $and: [
              { show_details: prepareData.show_date },
              {
                game_name: req.query.game_name,
              },
            ],
          },
        },
        {
          $sort: {
            created_on: -1,
          },
        },
      ])
      .then(async (data) => {
        console.log("data.length", data.length);
        // if (data.length > 0) {
        for (let i = 0; i < data[0].wining_booking.length; i++) {
          let winningData = [];
          console.log("i and length", i, data.length);
          const element = data[0].wining_booking[i];
          // console.log('element', element)
          await element.booking_data.forEach(async (props) => {
            // console.log('props', props)
            if (props.lottery_price !== 0) {
              await winningData.push(props);
            }
          });
          element["winning_data"] = winningData;
          delete element.booking_data;

          console.log("element>>>>>>>>>", element);
          if (data[0].wining_booking.length == i + 1) {
            console.log("JSON.Stringy", JSON.stringify(data));
            res.json({
              success: true,
              data: data,
              statuscode: 400,
              status: "list generated",
            });
          }
        }
        // } else {
        // res.json({
        //   success: false,
        //   data: {},
        //   statuscode: 400,
        //   status: "No Data Found",
        // });
        // }
      })
      .catch((error) => {
        console.log("error", error);
        res.json({
          success: false,
          data: error,
          statuscode: 400,
          status: "list generated",
        });
      });
  } catch (error) {
    console.log("error", error);
    res.json({
      success: false,
      data: error,
      statuscode: 400,
      status: "list generated",
    });
  }
});
router.get("/BrokerWinningResult", async (req, res) => {
  try {
    console.log("req.query", req.query);
    let prepareData = {};
    if (
      req.query.showTime !== "" ||
      req.query.showTime !== null ||
      req.query.showTime !== undefined
    ) {
      prepareData["show_date"] = new Date(req.query.showTime);
    } else {
      res.json({
        success: false,
        data: {},
        statuscode: 400,
        status: "required Show Time ",
      });
    }
    if (
      req.query.refered_user_id !== "" ||
      req.query.refered_user_id !== null ||
      req.query.refered_user_id !== undefined
    ) {
      prepareData["refered_user_id"] = req.query.refered_user_id;
    }
    if (
      req.query.user_id !== "" ||
      req.query.user_id !== null ||
      req.query.user_id !== undefined
    ) {
      prepareData["user_id"] = req.query.user_id;
    }
    // console.log(
    //   "fgdfg",
    //   { show_details: prepareData.show_date },
    //   {
    //     game_name: req.query.game_name,
    //   }
    // );
    console.log("refered_user_id",prepareData)
    winningReport
      .aggregate([
        {
          $match: {
            $and: [
              { show_details: prepareData.show_date },
              {
                game_name: req.query.game_name,
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$wining_booking",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "referals",
            localField: "wining_booking.user_id",
            foreignField: "user_id",
            as: "result",
          },
        },
        {
          $unwind: {
            path: "$result",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            // $and: [{ 'wining_booking.user_id': prepareData.user_id }],
            ...(prepareData.user_id && {
              "wining_booking.user_id": Number(prepareData.user_id),
            }),
            ...(prepareData.refered_user_id && {
              "result.refered_user_id": Number(prepareData.refered_user_id),
            }),
          },
        },
        {
          $group: {
            _id: "$_id",
            game_name: { $first: "$game_name" },
            winning_number: { $first: "$winning_number" },
            winning_number_letters: { $first: "$winning_number_letters" },
            board_details: { $first: "$board_details" },
            show_details: { $first: "$show_details" },
            overallTicket: { $first: "$overallTicket" },
            overallTicetprice: { $first: "$overallTicetprice" },
            overalluserprice: { $first: "$overalluserprice" },
            total_refered_comission: { $first: "$total_refered_comission" },
            wining_booking: {
              $push: {
                user_id: "$wining_booking.user_id",
                refered_user_id: "$wining_booking.refered_user_id",
                refered_role_id: "$wining_booking.refered_role_id",
                game_id: "$wining_booking.game_id",
                game_name: "$wining_booking.game_name",
                phone: "$wining_booking.phone",
                showTime: "$wining_booking.showTime",
                published_status: "$wining_booking.published_status",
                booking_id: "$wining_booking.booking_id",
                booking_data: "$wining_booking.booking_data",
                ticket_price: "$wining_booking.ticket_price",
                totalTikect: "$wining_booking.totalTikect",
                total_price: "$wining_booking.total_price",
                created_on: "$wining_booking.created_on",
                userprice: "$wining_booking.userprice",
              },
            },
            created_on: { $first: "$created_on" },
            winning_id: { $first: "$winning_id" },
          },
        },
        {
          $sort: {
            created_on: -1,
          },
        },
      ])
      .then(async (data) => {
        console.log("data.length", data[0]);
        let overalluserprice = 0;
        let overallTicetprice = 0;
        let overallTicket=0
        let total_refered_comission=0
        // if (data.length > 0) {
        for (let i = 0; i < data[0].wining_booking.length; i++) {
          let winningData = [];
          console.log("i and length", i, data.length);
          const element = data[0].wining_booking[i];
          // console.log('element', element)
          await element.booking_data.forEach(async (props) => {
            // console.log('props', props)
            if (props.lottery_price !== 0) {
              await winningData.push(props);
              overalluserprice = overalluserprice + props.lottery_price;
            }
          });
          element["winning_data"] = winningData;
          delete element.booking_data;
          overallTicetprice = element.total_price + overallTicetprice;
          overallTicket = element.totalTikect + overallTicket;

          console.log("element>>>>>>>>>", element);
          console.log("overalluserprice", overalluserprice);
          console.log("overallTicetprice", overallTicetprice);
          console.log("overallTicket", overallTicket);
          console.log("total_refered_comission", total_refered_comission);
          console.log("data",data)
          data[0].overalluserprice=overalluserprice
          data[0].overallTicetprice=overallTicetprice
          data[0].overallTicket=overallTicket
          data[0].total_refered_comission=total_refered_comission
          if (data[0].wining_booking.length == i + 1) {
            // console.log("JSON.Stringy", JSON.stringify(data));
            res.json({
              success: true,
              data: data,
              statuscode: 400,
              status: "list generated",
            });
          }
        }
        // } else {
        // res.json({
        //   success: false,
        //   data: {},
        //   statuscode: 400,
        //   status: "No Data Found",
        // });
        // }
      })
      .catch((error) => {
        console.log("error", error);
        res.json({
          success: false,
          data: error,
          statuscode: 400,
          status: "list generated",
        });
      });
  } catch (error) {
    console.log("error", error);
    res.json({
      success: false,
      data: error,
      statuscode: 400,
      status: "list generated",
    });
  }
});

module.exports = router;
