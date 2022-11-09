const express = require("express");
const router = express.Router();
const booking = require("../app_models/booking");
const { route } = require("./live_result");

router.post("/bookingCreate", async (req, res) => {
  let data = req.body;
//   console.log("data", data);
  let preparedata = {
    user_id: data.user_id,
    role_id: data.role_id,
    game_id: data.game_id,
    booking_data: data.booking_data,
    total_price: data.total_price,
  };
  let boardCrate = new booking(preparedata);
  await boardCrate.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "Booking create successfully",
    });
  });
});

router.get("/getall", async (req, res) => {
    let query = req.query;
    console.log("query", query);
    let searchFilter = {};
    let data = [];
    if (query.user_id !== "") {
        // data.user_id = { $in: query.user_id };
        // data["user_id"] = { $in: query.user_id };
        // let field = { user_id: Number(query.user_id) };
        // data.push(field);
        searchFilter["user_id"] = parseInt(query.user_id);
      }
      if (
        query.datefrom !== "" &&
        // query.phonenumber !== "0" &&
        query.datefrom !== NaN
      ) {
        // let field = { phone: Number(query.phone) };
        // data.push(field);
        // searchFilter["created_on"] = $lte: new Date(query.fromdate);
      }
      if (
        query.role_type !== "" &&
        // query.role_type !== "0" &&
        query.role_type !== NaN
      ) {
        // let field = { role_id: Number(query.role_id) };
        // data.push(field);
        searchFilter["role_id"] = Number(query.role_type);
      }
       //                 $lte: new Date("2022-08-11T06:25:18.118+00:00"),
      //                 $gte: new Date("2022-08-11T05:59:33.060+00:00"),
      //               },
    booking.aggregate([
        // {
        //     $match: searchFilters,
        // },
        {
            $lookup: {
              from: "referals",
              localField: "user_id",
              foreignField: "user_id",
              as: "referalList",
            },
          },
    ])
    
    .then((data) => {
    res.json({
      success: true,
      data: data,
      statuscode: 200,
      status: "list create successfully",
    });
  });
});

router.put("/updateboard", async (req, res) => {
  let data = req.body;
  console.log("data", data);
  let board_id = data.board_id;
  let preparedata = {
    board_name: data.board_name,
    ticket_price: data.ticket_price,
    board_letters: data.board_letters,
    board_leter_format: data.board_leter_format,
    price_amount: data.price_amount,
  };
  board
    .findOneAndUpdate({ board_id: board_id }, preparedata, { new: true })
    .then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "Board updated successfully",
      });
    });
});
router.delete("/boarddelete/:id", async (req, res) => {
  let board_id = req.params.id;
  board.deleteOne({ board_id: board_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "board delete successfully",
      data: data,
    });
  });
});

module.exports = router;
