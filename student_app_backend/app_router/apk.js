const express = require("express");
const router = express.Router();
var multer = require("multer");
var path = require("path");
const Apk = require("../app_models/apk");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..",'assets'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });
router.post("/create", upload.single("apkFile"), function (req, res) {
  try {
    console.log("__dirname",__dirname)
    var originalFileName = req.file.filename;
    let body = req.body;
    console.log("body", body);
    let preparedata = {
      hint: body.hint,
      file_name: originalFileName,
    };
    let apk = new Apk(preparedata);
    apk
      .save()
      .then((data) => {
        res.json({
          success: true,
          statuscode: 200,
          status: "created successfully",
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          statuscode: 202,
          status: error,
        });
      });
  } catch (error) {
    console.log("error", error);
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.get("/get", async (req, res) => {
  try {
    Apk.find()
      .then((data) => {
        res.json({
          success: true,
          statuscode: 200,
          data: data,
          status: "created successfully",
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          statuscode: 202,
          status: error,
        });
      });
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    console.log("params", req.body);
    let id = req.body.id;
    if (req.body.id == "") {
      res.json({
        success: false,
        statuscode: 202,
        sttus: "customer care id is required",
      });
    }
    Apk.deleteOne({ apk_id: id })
      .then((data) => {
        res.json({
          success: true,
          statuscode: 200,
          sttus: "delete successfully",
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          statuscode: 202,
          status: error,
        });
      });
  } catch (error) {
    console.log("error", error);
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.put("/put", upload.single("apkFile"), async (req, res) => {
  try {
    let id = req.body.id;
    if (req.body.id == "") {
      res.json({
        success: false,
        statuscode: 202,
        sttus: "customer care id is required",
      });
    }
    console.log(">>>>");
    var originalFileName = req.file?.filename?req.file.filename:"";
    let body = req.body;
    console.log(">>>>", originalFileName);
    console.log(">>>>", req.body);
    let preparedata = {
      hint: body.hint,
      ...(originalFileName && { file_name: originalFileName }),
    };
    console.log("preparedata",preparedata)
    Apk.findOneAndUpdate({ apk_id: id }, preparedata, { new: true })
      .then((data) => {
        res.json({
          success: true,
          statuscode: 200,
          status: "updated successfully",
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          statuscode: 202,
          status: error,
        });
      });
  } catch (error) {
    console.log("error", error);
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.get("/GetLastApk",async (req,res)=>{
    try {
        Apk.find().sort({created_on:-1})
          .then((data) => {
            // let apialink=data[0].file_name
            // let link=`http://54.234.103.68:4001/images/${apialink}`
            res.json({
              success: true,
              statuscode: 200,
              data: data[0],
              status: "created successfully",
            });
          })
          .catch((error) => {
            res.json({
              success: false,
              statuscode: 202,
              status: error,
            });
          });
      } catch (error) {
        res.json({
          success: false,
          statuscode: 500,
          status: error,
        });
      }  
})
module.exports = router;
