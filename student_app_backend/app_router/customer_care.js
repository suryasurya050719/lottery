const express = require("express");
const router = express.Router();
var multer = require("multer");
var path = require("path");
const customCare = require("../app_models/customer_care");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });
router.post("", upload.single("customerImage"), function (req, res) {
  console.log(">file", req.file);
  console.log(">body", req.body);
  var originalFileName = req.file.filename;
  let body = req.body;
  console.log(">>file name", originalFileName);
  let preparedata = {
    user_id: Number(body.id),
    question: body.question,
    answer: body.answer,
    file_name: originalFileName,
  };
  let customCaredata = new customCare(preparedata);
  customCaredata.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "created successfully",
    });
  });
});

router.get("", async (req, res) => {
  customCare.find().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "created successfully",
    });
  });
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  if (req.params.id == "") {
    res.json({
      success: false,
      statuscode: 202,
      sttus: "customer care id is required",
    });
  }
  customCare.deleteOne({ customer_care_id: id }).then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      sttus: "delete successfully",
    });
  });
});

router.put("/:id", upload.single("customerImage"), async (req, res) => {
  let id = req.params.id;
  if (req.params.id == "") {
    res.json({
      success: false,
      statuscode: 202,
      sttus: "customer care id is required",
    });
  }
  console.log(">>>>");
  var originalFileName = req.file.filename;
  let body = req.body;
  console.log(">>>>", originalFileName);
  console.log(">>>>", req.body);
  let preparedata = {
    user_id: Number(body.id),
    question: body.question,
    answer: body.answer,
    file_name: originalFileName == "" ? body.file_name : originalFileName,
  };
  customCare
    .findOneAndUpdate({ customer_care_id: id }, preparedata, { new: true })
    .then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "updated successfully",
      });
    });
});
module.exports = router;
