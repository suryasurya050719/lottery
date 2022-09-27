const express = require("express");
const share_account = require("../app_models/share_account");
const shareAccount = require("../app_models/share_account");
const router = express.Router();

router.post("", async (req, res) => {
  let body = req.body;
  let preparedata = {
    user_id: body.user_id,
    account_type: body.account_type,
    account_name: body.account_name,
    bank_name: body.bank_name,
    branch_name: body.branch_name,
    ifsc_code: body.ifsc_code,
    phon: body.phon,
    enter_name: body.enter_name,
  };
  let data = new shareAccount(preparedata);
  data.save().then((insertdata) => {
    console.log("insertdata", insertdata);
    res.json({
      success: true,
      statuscode: 200,
      status: "Account create successfully",
    });
  });
});

router.get("/singleuserlist", async (req, res) => {
  let query = req.query;
  share_account.find({ user_id: query.id }).then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "list generate successfully",
    });
  });
});

router.delete("/singlraccount/:id", (req, res) => {
  let user_id = req.params.id;
  user.deleteOne({ share_account_id: user_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "account delete successfully",
      data: data,
    });
  });
});

router.put("/update", async (req, res) => {
  let body = req.body;
  console.log("body", body);
  let data = {
    account_type: body.account_type,
    account_name: body.account_name,
    bank_name: body.bank_name,
    branch_name: body.branch_name,
    ifsc_code: body.ifsc_code,
    phon: body.phon,
    enter_name: body.enter_name,
  };
  console.log("bodatady", data);
  user
    .findOneAndUpdate({ share_account_id: data.share_account_id }, data, {
      new: true,
    })
    .then((data) => {
      console.log("data", data);
      res.send({
        statuscode: 200,
        status: "account updated successfully",
        data: data,
      });
    });
});

module.exports = router;
