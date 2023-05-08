const express = require("express");
const router = express.Router();
const instandFound = require("../app_models/instandFound");
const { default: mongoose } = require("mongoose");

router.post("", async (req, res) => {
  let body = req.body;
  let preparedata = {
    instandFound_status: body.instandFound_status,
  };
  let data = new instandFound(preparedata);
  data.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "InstandFound create successfully",
    });
  });
});

router.get("", async (req, res) => {
    instandFound.find().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "list generate successfully",
    });
  });
});

router.put("", async (req, res) => {
  let body = req.body;
  console.log("data", body);
//   let live_result_id = body.live_result_id;
  if (body._id == "") {
    res.json({
      success: false,
      statuscode: 202,
      status: "id is required",
    });
  }
  let preparedata = {
    instandFound_status: !body.instandFound_status,
  };
  console.log("preparedata",preparedata)
  instandFound
    .findOneAndUpdate({ _id: mongoose.Types.ObjectId(body._id) }, preparedata, {
      new: true,
    })
    .then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "InstandFound updated successfully",
      });
    });
});

module.exports = router;
