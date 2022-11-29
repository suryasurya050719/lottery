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
const saltRounds = 10;

router.post("", async (req, res) => {
  let body = req.body;
  if (req.body.user_id == "") {
    res.send({
      status: false,
      statuscode: 202,
      message: "require user_id",
    });
  }
  if (req.body.position == "") {
    res.send({
      status: false,
      statuscode: 202,
      message: "require position",
    });
  }
  if (req.body.amount == "") {
    res.send({
      status: false,
      statuscode: 202,
      message: "require amount",
    });
  }
  // console.log("payment key", key);
  // let body = req.body;
  var preparedata = {
    user_id: body.user_id,
    position: body.position,
    amount: body.amount,
    commission: false,
    transection_from_userid: body.transection_from_userid,
    transection_to_userid: body.transection_to_userid,
    transection_from_type: body.transection_from_type,
    transection_to_type: body.transection_to_type,
    status: "Pending",
  };
  if (body.position == "INC") {
    var amount = body.amount;
    // referalFunction.referalAddMony(preparedata);
  } else if (body.position == "DEC") {
    var amount = -body.amount;
  }

  let newtransection = new transection(preparedata);
  await newtransection.save().then(async (data) => {
    let userdata = data;
    user.find({ user_id: data.user_id }).then(async (datas) => {
      console.log("data", datas, userdata);
      let user = datas[0];
      // let transection =userdata
      let payment = {
        key: "6ba06afe-c906-485e-855a-1615a6d420d8",
        client_txn_id: `${userdata.transection_id}`,
        amount: `${userdata.amount}`,
        p_info: user.name,
        customer_name: user.name,
        customer_email: "arunkumar3d3d@gmail.com",
        customer_mobile: `${user.phone}`,
        redirect_url: "http://192.168.0.75:4001/payment/callback",
        udf1: body.Dedection_status,
        udf2: body.transection_from_userid,
      };
      console.log("payment transection", payment);
      await axios
        .post("https://merchant.upigateway.com/api/create_order", payment)
        .then((data) => {
          console.log("data", data.data);
          res.send({
            statuscode: 200,
            // status: "Money Add successfully",
            data: data.data,
            client_txn_id: payment.client_txn_id,
          });
        });
    });
  });
  // res.send({
  //   statuscode: 200,
  //   status: "Money Add successfully",
  //   //data: data,
  // });
});

router.get("/callback", async (req, res) => {
  let client_txn = req.query.client_txn_id;
  transection.findOne({ transection_id: client_txn }).then((data) => {
    let dateformat = moment(data.created_on).format("DD-MM-yyyy");
    let client_txn = req.query.client_txn_id;
    let txn_id = req.query.txn_id;
    let callback = {
      key: "6ba06afe-c906-485e-855a-1615a6d420d8",
      client_txn_id: client_txn,
      txn_date: `${dateformat}`,
    };
    axios
      .post("https://merchant.upigateway.com/api/check_order_status", callback)
      .then(async (data) => {
        console.log("dtaa", data.data);
        let item = data.data;
        let preparedata = {
          status: "success",
          TransectionStatus: {
            id: item.data.id,
            customer_vpa: item.data.customer_vpa,
            customer_name: item.data.customer_name,
            txnAt: item.data.txnAt,
            Merchand_Name: item.data.Merchant.name,
            Merchand_upi_id: item.data.Merchant.upi_id,
          },
        };
        await transection
          .findOneAndUpdate(
            { transection_id: item.data.client_txn_id },
            preparedata,
            { new: true }
          )
          .then((item01) => {
            console.log("data", item01);
            wallet
              .findOneAndUpdate(
                { user_id: item01.user_id },
                { $inc: { current_amount: item01.amount } },
                { new: true }
              )
              .then((item02) => {
                console.log("iteam02", item02);
                if (data.udf1 !== "OWN" && data.udf1 !== "") {
                  if (item02.Referal_amount_paid === false) {
                    let preparedata = {
                      user_id: item02.user_id,
                      position: "INC",
                      amount: item01.amount,
                    };
                    referalFunction.referalAddMony(preparedata);
                  }
                }
              });
            res.redirect("http://localhost:4200/wallet");
          });
      });
  });
});

router.post("/check_status", async (req, res) => {
  let body = req.body;
  if (body.tx_id == "") {
    res.send({
      statuscode: 202,
      status: "tx_id is required",
    });
  }
  if (body.body.date == "") {
    res.send({
      statuscode: 202,
      status: "date is required",
    });
  }
  let data = {
    key: "6ba06afe-c906-485e-855a-1615a6d420d8",
    client_txn_id: body.tx_id,
    txn_date: body.date,
  };
  await axios
    .post("https://merchant.upigateway.com/api/check_order_status", data)
    .then((data) => {
      console.log("data", data.data);
      res.send({
        statuscode: 200,
        // status: "Money Add successfully",
        data: data.data,
      });
    });
});
router.post("/mobile_callback", async (req, res) => {
  // console.log("dtaa", data.data);
  let body = req.body.data;
  console.log("dtaa", body);

  let item = body;
  let preparedata = {
    status: "success",
    TransectionStatus: {
      id: item.data.id,
      customer_vpa: item.data.customer_vpa,
      customer_name: item.data.customer_name,
      txnAt: item.data.txnAt,
      Merchand_Name: item.data.Merchant.name,
      Merchand_upi_id: item.data.Merchant.upi_id,
    },
  };
  await transection
    .findOneAndUpdate(
      { transection_id: item.data.client_txn_id },
      preparedata,
      { new: true }
    )
    .then((item01) => {
      console.log("data", item01);
      wallet
        .findOneAndUpdate(
          { user_id: item01.user_id },
          { $inc: { current_amount: item01.amount } },
          { new: true }
        )
        .then((item02) => {
          console.log("iteam02", item02);
          // if (data.udf1 !== "OWN" && data.udf1 !== "") {
          if (item02.Referal_amount_paid === false) {
            let preparedata = {
              user_id: item02.user_id,
              position: "INC",
              amount: item01.amount,
            };
            referalFunction.referalAddMony(preparedata);
          }
          res.send({
            statuscode: 200,
            status: "Money Add successfully",
            // data: data.data,
          });
          // }
        });

      // res.redirect("http://localhost:4200/wallet");
    });
});

module.exports = router;
