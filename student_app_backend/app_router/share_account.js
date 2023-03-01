const express = require("express");
const share_account = require("../app_models/share_account");
const shareAccount = require("../app_models/share_account");
const router = express.Router();

router.post("", async (req, res) => {
  let body = req.body;
  console.log("body", body);
  let preparedata = {
    user_id: body.user_id,
    account_number: body.AccountNumber,
    account_name: body.HolderName,
    branch_name: body.Branchname,
    ifsc_code: body.IFSCcode,
    bank_name: body.bank_name,
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
  if (query.id == "") {
    res.json({
      success: false,
      statuscode: 202,
      status: "user_id is required",
    });
  }
  share_account.find({ user_id: query.id }).then((data) => {
    res.json({
      success: true,
      data: data,
      statuscode: 200,
      status: "list generate successfully",
    });
  });
});

router.delete("/singlraccount/:id", (req, res) => {
  let user_id = req.params.id;
  if (req.params.id == "") {
    res.json({
      success: false,
      statuscode: 202,
      status: "user_id is required",
    });
  }
  share_account.deleteOne({ share_account_id: user_id }).then((data) => {
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
  if (data.share_account_id == "") {
    res.send({
      statuscode: 202,
      status: "share_account_id is required",
    });
  }
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
  share_account
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

// dashboard

router.get("/sharedaccountlist", async (req, res) => {
  share_account
    .aggregate([
      {
        $facet: {
          Admin: [
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "user_id",
                pipeline: [
                  {
                    $match: { role_id: 1 },
                  },
                ],
                as: "List",
              },
            },
            {
              $unwind: {
                path: "$List",
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
          Broker: [
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "user_id",
                pipeline: [
                  {
                    $match: { role_id: 2 },
                  },
                ],
                as: "List",
              },
            },
            {
              $unwind: {
                path: "$List",
                preserveNullAndEmptyArrays: false,
              },
            },
          ],
          Customer: [
            {
              $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "user_id",
                pipeline: [
                  {
                    $match: { role_id: 3 },
                  },
                ],
                as: "List",
              },
            },
            {
              $unwind: {
                path: "$List",
                preserveNullAndEmptyArrays: false,
              },
            },
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
  if (body.share_account_id == "") {
    res.send({
      statuscode: 202,
      status: "share_account_id is required",
    });
  }
  let data = {
    share_broker_type: body.status == true ? false : true,
    share_customer_type: body.status == true ? false : true,
  };
  console.log("bodatady", data);
  share_account
    .findOneAndUpdate({ share_account_id: body.share_account_id }, data, {
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
  if (body.share_account_id == "") {
    res.send({
      statuscode: 202,
      status: "share_account_id is required",
    });
  }
  console.log("body", body);
  let data = {
    share_broker_type: body.status == true ? false : true,
    share_customer_type: body.status == true ? false : true,
  };
  share_account
    .updateMany({ share_account_id: body.share_account_id }, data, {
      multi: true,
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

module.exports = router;
