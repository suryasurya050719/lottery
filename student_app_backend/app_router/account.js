const express = require("express");
const router = express.Router();
const account = require("../app_models/account");
const user = require("../app_models/user");
const { route } = require("./live_result");

router.post("", async (req, res) => {
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
});

router.get("/allbrokerslist", async (req, res) => {
  account.find({ role_id: 2 }).then((data) => {
    res.json({
      success: true,
      data: data,
      statuscode: 200,
      status: "Board create successfully",
    });
  });
});
router.get("/ownaccountlist/:id", async (req, res) => {
  let user_id = req.params.id;
  account.find({ user_id: user_id }).then((data) => {
    res.json({
      success: true,
      data: data,
      statuscode: 200,
      status: "Board create successfully",
    });
  });
});

router.put("/updateaccount", async (req, res) => {
  let data = req.body;
  console.log("data", data);
  let account_id = data.account_id;
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
});
router.delete("/accountdelete/:id", async (req, res) => {
  let account_id = req.params.id;
  account.deleteOne({ account_id: account_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "board delete successfully",
      data: data,
    });
  });
});
router.get("/sharedaccountlist", async (req, res) => {
  user
    .aggregate([
      {
        $facet: {
          Admin: [
            {
              $match: { role_id: 1 },
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
              $match: { role_id: 2 },
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
          Customer: [
            {
              $match: { role_id: 3 },
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
      res.send({
        statuscode: 200,
        status: "account updated successfully",
        data: data,
      });
    });
});

router.put("/updateone", async (req, res) => {
  let body = req.body;
  console.log("body", body);
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
    });
});
router.put("/updatemany", async (req, res) => {
  let body = req.body;
  console.log("body", body);
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
    });
});

module.exports = router;
