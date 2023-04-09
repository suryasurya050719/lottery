const express = require("express");
const router = express.Router();
const Notification = require("../app_models/Notification");
const user = require("../app_models/user");
const numberFunction = require("../common/numberFunction");
const { route } = require("./live_result");

router.get("/AllList", async (req, res) => {
  try {
    Notification.aggregate([
      {
        $sort: {
          created_on: -1,
        },
      },
    ])
      .then((data) => {
        res.send({
          status: true,
          statuscode: 200,
          status: "List Generated successfully",
          data: data,
        });
      })
      .catch((error) => {
        res.send({
          status: false,
          statuscode: 202,
          status: "Failsed",
          data: error,
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

router.get("/SingleList", async (req, res) => {
  try {
    if (req.body.user_id !== "" && req.body.user_id !== null) {
      Notification.aggregate([
        {
          $match: { user_id: req.body.user_id, message_status: false },
        },
        {
          $sort: {
            created_on: -1,
          },
        },
      ])
        .then((data) => {
          res.send({
            statuscode: 200,
            status: true,
            status: "List Generated successfully",
            data: data,
          });
        })
        .catch((error) => {
          res.send({
            statuscode: 202,
            status: false,
            status: "Failsed",
            data: error,
          });
        });
    } else {
      res.send({
        statuscode: 202,
        status: false,
        status: "User id is Required",
        data: {},
      });
    }
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.get("/StatusChange", async (req, res) => {
  try {
    if (req.body.notification_id !== "" && req.body.notification_id !== null) {
      Notification.findOneAndUpdate(
        { notification_id: req.body.notification_id },
        { message_status: true },
        { new: true }
      )
        .then((data) => {
          res.send({
            statuscode: 200,
            status: true,
            status: "Updated successfully",
            data: data,
          });
        })
        .catch((error) => {
          res.send({
            statuscode: 202,
            status: false,
            status: "Failsed",
            data: error,
          });
        });
    } else {
      res.send({
        statuscode: 202,
        status: false,
        status: "User id is Required",
        data: {},
      });
    }
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

module.exports = router;
