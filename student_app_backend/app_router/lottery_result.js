const express = require("express");
const router = express.Router();
const booking = require("../app_models/booking");

router.get("/result", async (req, res) => {
  let data = ["1", "2", "3", "4"];
  let date = new Date();
  let show = "15:00";
  let gameName = "Dear";
  booking
    .aggregate([
      {
        $match: {
          $and: [{ game_name: "Dear" }, { showTime: "18:00" }],
        },
      },
    ])
    .then((data) => {
      data.forEach((data1) => {
        data1.booking_data.forEach((data2) => {
          if (data2.board_name == "1 Digit Board") {
          } else if (data2.board_name == "2 Digit Board") {
          } else if (data2.board_name == "3 Digit Board Half") {
          } else if (data2.board_name == "3 Digit Board Full") {
          } else if (data2.board_name == "box") {
          } else if (data2.board_name == "all board") {
          } else if (data2.board_name == "4 Digit Board Full") {
          }
        });
      });
    });
});

module.exports = router;
