const express = require("express");
const router = express.Router();
const account = require("../app_models/account");
const referral = require("../app_models/referal");
const user = require("../app_models/user");
const numberFunction = require("../common/numberFunction");
const { route } = require("./live_result");

router.post("", async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    let preparedata = {
      user_id: data.user_id,
      role_id: data.role_id,
      type: data.type,
      account_number: data.account_number,
      account_name: data.account_name,
      bank_name: data.bank_name,
      branch_name: data.branch_name,
      ifsc_code: data.ifsc_code,
      upi_id: data.upi_id,
      phone: data.phone,
      name: data.name,
    };
    let accountCreate = new account(preparedata);
    await accountCreate.save().then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "Account create successfully",
      });
    });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.get("/allbrokerslist", async (req, res) => {
  try {
    account.find({ role_id: 2 }).then((data) => {
      res.json({
        success: true,
        data: data,
        statuscode: 200,
        status: "Board create successfully",
      });
    });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});
router.post("/ownaccountlist", async (req, res) => {
  try {
    let user_id = req.body.user_id;
    console.log("user_id", user_id);
    if (user_id == "") {
      res.json({
        success: false,
        statuscode: 202,
        status: "User Id Required",
      });
    }
    account.find({ user_id: user_id }).then((data) => {
      res.json({
        success: true,
        data: data,
        statuscode: 200,
        status: "Board create successfully",
      });
    });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.put("/updateaccount", async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    let account_id = data.account_id;
    if (req.body.account_id == "") {
      res.json({
        success: false,
        statuscode: 202,
        status: "Account Id required",
      });
    }
    let preparedata = {
      user_id: data.user_id,
      role_id: data.role_id,
      type: data.type,
      account_number: data.account_number,
      account_name: data.account_name,
      bank_name: data.bank_name,
      branch_name: data.branch_name,
      ifsc_code: data.ifsc_code,
      upi_id: data.upi_id,
      phone: data.phone,
      name: data.name,
    };
    account
      .findOneAndUpdate({ account_id: account_id }, preparedata, { new: true })
      .then((data) => {
        res.json({
          success: true,
          statuscode: 200,
          status: "account updated successfully",
        });
      });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});
router.delete("/accountdelete", async (req, res) => {
  try {
    let account_id = req.body.account_id;
    if (account_id == "") {
      res.json({
        success: false,
        statuscode: 202,
        status: "Account Id required",
      });
    }
    account.deleteOne({ account_id: account_id }).then((data) => {
      res.send({
        statuscode: 200,
        status: "board delete successfully",
        data: data,
      });
    });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});
router.get("/sharedaccountlist", async (req, res) => {
  try {
    console.log("req.body", req.query.id);
    console.log("req.body", req.query.id !== "");
    let filter = [{ isOtpVerify: true }, { role_id: 2 }];
    if (req.query.id !== "") {
      // let user_id = await numberFunction.justNumbers(query.user_id);
      console.log("id", numberFunction.justNumbers(req.query.id));
      filter.push({
        user_id: numberFunction.justNumbers(req.query.id),
      });
    }
    console.log("filter", filter);
    user
      .aggregate([
        {
          $facet: {
            Admin: [
              {
                $match: {
                  $and: [{ isOtpVerify: true }, { role_id: 1 }],
                },
              },
              {
                $lookup: {
                  from: "accoounts",
                  localField: "user_id",
                  foreignField: "user_id",
                  as: "List",
                },
              },
              // {
              //   $unwind: {
              //     path: "$List",
              //     preserveNullAndEmptyArrays: false,
              //   },
              // },
            ],
            Broker: [
              {
                $match: { $and: filter },
              },
              {
                $lookup: {
                  from: "accoounts",
                  localField: "user_id",
                  foreignField: "user_id",
                  as: "List",
                },
              },
              {
                $unwind: {
                  path: "$List",
                  preserveNullAndEmptyArrays: false,
                },
              },
              {
                $group: {
                  _id: "$_id",
                  name: { $first: "$name" },
                  phone: { $first: "$phone" },
                  role_id: { $first: "$role_id" },
                  isOtpVerify: { $first: "isOtpVerify" },
                  status: { $first: "$status" },
                  otp: { $first: "$otp" },
                  modified_on: { $first: "$modified_on" },
                  created_on: { $first: "$created_on" },
                  user_id: { $first: "$user_id" },
                  password: { $first: "$password" },
                  referal_code: { $first: "$referal_code" },
                  List: { $push: "$List" },
                },
              },
            ],
            Customer: [
              {
                $match: { $and: [{ isOtpVerify: true }, { role_id: 3 }] },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "user_id",
                  foreignField: "user_id",
                  as: "List",
                },
              },
              // {
              //   $unwind: {
              //     path: "$List",
              //     preserveNullAndEmptyArrays: false,
              //   },
              // },
            ],
          },
        },
      ])
      .then((data) => {
        console.log("data", data);
        res.send({
          statuscode: 200,
          status: "account updated successfully",
          data: data,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          statuscode: 202,
          status: err,
        });
      });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.get("/CoustomerVisibleAccountList", async (req, res) => {
  try {
    console.log("data", req.query);
    let data = {};
    if (req.query.user_id) {
      data["user_id"] = req.query.user_id;
    } else {
      return res.json({
        success: false,
        statuscode: 400,
        status: "User Id Required",
      });
    }
    let admin = await account.aggregate([
      {
        $match: {
          $and: [{ customer_status: true }, { role_id: 1 }],
        },
      },
    ]);
    let Broker = await referral.aggregate([
      {
        $lookup: {
          from: "accoounts",
          localField: "user_id",
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
          user_id: Number(req.query.user_id),
        },
      },
      {
        $group: {
          _id: "$user_id",
          BrokerList: { $push: "$result" },
        },
      },
    ]);
    // let [adminList,BrokerList]=Promise.all([admin,Broker])
    res.json({
      success: true,
      statuscode: 200,
      data: admin.concat(Broker[0].BrokerList),
      status: "List Generted",
    });
    console.log("adminList,BrokerList", admin, Broker);
  } catch (error) {
    console.log("error", error);
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.put("/updateone", async (req, res) => {
  try {
    let body = req.body;
    console.log("body", body);
    if (req.body.id == "") {
      res.send({
        statuscode: 202,
        status: "Account id is required",
        data: data,
      });
    }
    let data = {
      customer_status: body.customer,
      broker_status: body.broker,
    };
    console.log("bodatady", data);
    account
      .findOneAndUpdate({ account_id: body.id }, data, {
        new: true,
      })
      .then((data) => {
        console.log("data", data);
        res.send({
          statuscode: 200,
          status: "user updated successfully",
          data: data,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          statuscode: 202,
          status: err,
        });
      });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});
router.put("/updatemany", async (req, res) => {
  try {
    let body = req.body;
    console.log("body", body);
    if (req.body.id == "") {
      res.send({
        statuscode: 202,
        status: "User id Required",
      });
    }
    let data = {
      customer_status: body.customer == true ? false : true,
    };
    console.log("bodatady", data);
    account
      .updateMany(
        { user_id: body.id },
        { $set: { customer_status: data.customer_status } },
        {
          multi: true /** will update all the documents matching the filter criteria and not only the first document.*/,
        }
      )
      .then((data) => {
        console.log("data", data);
        res.send({
          statuscode: 200,
          status: "user updated successfully",
          data: data,
        });
      })
      .catch((err) => {
        res.json({
          success: false,
          statuscode: 202,
          status: err,
        });
      });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

module.exports = router;
