const express = require("express");
const router = express.Router();
const user=require("../app_models/user")
const myRequest = require("../app_models/my_request");

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
