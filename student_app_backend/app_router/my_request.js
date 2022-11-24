const express = require("express");
const router = express.Router();
const user=require("../app_models/user")
const myRequest = require("../app_models/my_request");
var path = require("path");
var multer = require("multer");


router.post("", async (req, res) => {
  let body = req.body;
  user.findOne({user_id:body.user_id}).then((data)=>{
    let preparedata = {
        user_id:body.user_id,
        role_id:data.role_id,
        user_name:data.name,
        title: body.title,
        details: body.details,
        amount:body.amount,
        phone:data.phone,
      };
      let insertData = new myRequest(preparedata);
      insertData.save().then((data) => {
        res.json({
          success: true,
          statuscode: 200,
          status: "request create successfully",
        });
      });
  })
});

router.get("", async (req, res) => {
    let status=req.query.status
    myRequest.find({request_status:Number(status)}).then((data) => {
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
router.put("/approved",upload.single("customerImage"), async (req, res) => {
  var originalFileName = req.file.originalname;
  console.log("data",originalFileName)
  let body = req.body;
  console.log("data", body);
  let _id = body.id;
  let preparedata = {
    file_name: originalFileName,
    request_status:2
  };
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
});

router.put("/rejected", async (req, res) => {
  let body = req.body;
  let _id = body.id;
  let preparedata = {
    rejected_reason: req.body.Reason,
    request_status:3
  };
  myRequest
    .findOneAndUpdate({ _id: _id }, preparedata, {
      new: true,
    })
    .then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "status updated successfully",
      });
    });
});

module.exports = router;
