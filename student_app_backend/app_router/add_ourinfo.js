const express = require("express");
const router = express.Router();
const add_ourinfo = require("../app_models/add_ourinfo");

router.post("", async (req, res) => {
try {
  let body = req.body;
  // console.log("bodt", body);
  let preparedata = {
    title: body.title,
    information: body.information,
  };
  let data = new add_ourinfo(preparedata);
  data.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "create successfully",
    });
  }).catch((err)=>{
    res.json({
      success: false,
      statuscode: 202,
      status: err,
    });
  })
} catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  });
}
});

router.get("", async (req, res) => {
try {
  add_ourinfo.find().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "list generate successfully",
    });
  }).catch((err)=>{
    res.json({
      success: false,
      statuscode: 202,
      status: err,
    });
  })
} catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  });
}
});

router.delete("/:id", (req, res) => {
try {
  let user_id = Number(req.params.id);
  if (req.params.id == "") {
    res.send({
      statuscode: 202,
      status: "Add ourinfo id required",
    });
  }
  add_ourinfo.deleteOne({ add_ourinfo_id: user_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "delete successfully",
    })
  }).catch((err)=>{
    res.json({
      success: false,
      statuscode: 202,
      status: err,
    });
  })
} catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  });
}
});
router.get("/:id", async (req, res) => {
try {
  let user_id = Number(req.params.id);
  if (req.params.id == "") {
    res.send({
      statuscode: 202,
      status: "Add ourinfo id required",
    });
  }
  add_ourinfo.findOne({ add_ourinfo_id: user_id }).then((data) => {
    res.send({
      data: data,
      statuscode: 200,
      status: "list successfully",
    });
  }).catch((err)=>{
    res.json({
      success: false,
      statuscode: 202,
      status: err,
    });
  })
} catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  });
}
});

router.put("/:id", async (req, res) => {
  try {
    let user_id = Number(req.params.id);
  if (req.params.id == "") {
    res.send({
      statuscode: 202,
      status: "Add ourinfo id required",
    });
  }
  let body = req.body;
  console.log("body", body, user_id);
  let preparedata = {
    title: body.title,
    information: body.information,
  };
  add_ourinfo
    .findOneAndUpdate({ ourinfo_id: user_id }, preparedata, {
      new: true,
    })
    .then((data) => {
      res.send({
        data: data,
        statuscode: 200,
        status: "updated successfully",
      });
    }).catch((err)=>{
      res.json({
        success: false,
        statuscode: 202,
        status: err,
      });
    })
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

module.exports = router;
