const express = require("express");
const router = express.Router();
const user = require("../app_models/user");
const myRequest = require("../app_models/my_request");
var path = require("path");
var multer = require("multer");
const wallet = require("../app_models/wallet");
const Transection = require("../app_models/transection");
const { Notification } = require("../common/Notification");


router.post("", async (req, res) => {
  let body = req.body;
  user.findOne({ user_id: body.user_id }).then((data) => {
    console.log("data",data)
    let preparedata = {
      user_id: body.user_id,
      role_id: data.role_id,
      account_type: body.account_type,
      account_details: body.account_details,
      user_name: data.name,
      amount: body.amount,
      phone: data.phone,
    };
    // Notification(
    //   preparedata.user_id,
    //   `Successfully Withdraw Request Created`
    // );
    let insertData = new myRequest(preparedata);
    insertData.save().then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "request create successfully",
      });
    });
  });
});

router.get("", async (req, res) => {
  let status = req.query.status;
  myRequest.find({ request_status: Number(status) }).then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "list generate successfully",
    });
  });
});
router.get("/status", async (req, res) => {
  let status = req.query.status;
  myRequest.find({ user_id: req.query.user_id }).then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "list generate successfully",
    });
  });
});
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });
router.put("/approved", upload.single("customerImage"), async (req, res) => {
  var originalFileName = req.file.originalname;
  console.log("data", originalFileName);
  let body = req.body;
  console.log("data", body);
  let _id = body.id;
  if (body.id == "") {
    res.json({
      success: false,
      statuscode: 202,
      status: "MyRequest id is required",
    });
  }
  let preparedata = {
    file_name: originalFileName,
    request_status: 2,
  };
  wallet.findOne({ user_id: body.user_id }).then((data) => {
    console.log("data", data);
    if (data.current_amount >= Number(req.body.amount)) {
      wallet
        .findOneAndUpdate(
          { user_id: body.user_id },
          { current_amount: data.current_amount - Number(req.body.amount) },
          { new: true }
        )
        .then((result) => {
          Notification(
            body.user_id,
            `Successfully Withdraw Request Approved`
          );
          transaction(req.body.amount, body.user_id);
          myRequest
            .findOneAndUpdate({ _id: _id }, preparedata, {
              new: true,
            })
            .then((data) => {
              res.json({
                success: true,
                statuscode: 200,
                status: "Board updated successfully",
              });
            });
        })
        .catch((err) => {
          res.json({
            success: false,
            statuscode: 202,
            status: err,
          });
        });
    } else {
      res.json({
        success: false,
        statuscode: 202,
        status: "insufficient found",
      });
    }
  });
});

router.put("/rejected", async (req, res) => {
  let body = req.body;
  let _id = body.id;
  if (body.id == "") {
    res.json({
      success: false,
      statuscode: 202,
      status: "MyRequest id is required",
    });
  }
  let preparedata = {
    rejected_reason: req.body.Reason,
    request_status: 3,
  };
  myRequest
    .findOneAndUpdate({ _id: _id }, preparedata, {
      new: true,
    })
    .then((data) => {
      Notification(
        data[0].user_id,
        `Sorry Your Request Rejected`
      );
      res.json({
        success: true,
        statuscode: 200,
        status: "status updated successfully",
      });
    });
});

router.get("/singleUser", (req, res) => {
  let status = req.query.user_id;
  console.log("status", status);

  myRequest.find({ user_id: req.query.user_id }).then((data) => {
    console.log("data", data);
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "list generate successfully",
    });
  });
});

async function transaction(amount, userid) {
  var transectiondata = {
    amount: amount,
    user_id: userid,
    transection_from_userid: 1,
    transection_from_roleid: 1,
    transection_to_userid: userid,
    transection_to_roleid: 3,
    transection_from_type: "Admin",
    transection_to_type: "Wallet",
    reason: "Withdraw request accept",
    position: "DEC",
    commission: false,
  };
  let transection = await new Transection(transectiondata)
    .save()
    .catch((error) => {
      console.log("error for trtansection", error);
    });
}

module.exports = router;
