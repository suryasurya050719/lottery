const express = require("express");
const router = express.Router();
const account = require("../app_models/account");
const { route } = require("./live_result");

router.post("", async (req, res) => {
  let data = req.body;
  //   console.log("data", data);
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

module.exports = router;
