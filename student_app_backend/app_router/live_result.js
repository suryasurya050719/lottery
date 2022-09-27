const express = require("express");
const router = express.Router();
const live_result = require("../app_models/live_result");

router.post("", async (req, res) => {
  let body = req.body;
  let preparedata = {
    title: body.title,
    url: body.url,
  };
  let data = new live_result(preparedata);
  data.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "list create successfully",
    });
  });
});

router.get("", async (req, res) => {
  live_result.find().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "list generate successfully",
    });
  });
});

router.delete("/:id", (req, res) => {
  let user_id = Number(req.params.id);
  console.log("gshdfashg", user_id);
  live_result.deleteOne({ live_result_id: user_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "delete successfully",
    });
  });
});

router.put("", async (req, res) => {
  let body = req.body;
  console.log("data", body);
  let live_result_id = body.live_result_id;
  let preparedata = {
    title: body.title,
    url: body.url,
  };
  live_result
    .findOneAndUpdate({ live_result_id: live_result_id }, preparedata, {
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

module.exports = router;
