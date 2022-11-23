const express = require("express");
const router = express.Router();
const booking = require("../app_models/booking");
const user = require("../app_models/user");

const { route } = require("./live_result");

router.post("/bookingCreate", async (req, res) => {
  let data = req.body;
  // console.log("data", data);
  let preparedata = {
    user_id: data.user_id,
    role_id: data.role_id,
    game_id: data.game_id,
    phone: data.phone,
    game_name: data.game_name,
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
  // let query = req.query;
  let query = req.query;
  console.log("query", query);
  let searchFilter = {};
  let created_on = {};
  if (query.user_id !== "") {
    searchFilter["user_id"] = parseInt(query.user_id);
  }
  if (query.phonenumber !== "" && query.phonenumber !== NaN) {
    searchFilter["phone"] = Number(query.phonenumber);
  }
  if (query.fromdate !== "") {
    created_on["$gt"] = new Date(query.fromdate);
  }
  if (query.todate !== "") {
    created_on["$lt"] = new Date(query.todate);
  }
  if (query.game_name !== "") {
    searchFilter["game_name"] = query.game_name;
  }
  let length = Object.keys(created_on).length;
  if (length > 0) {
    searchFilter["created_on"] = created_on;
  }
  let searchFilters = {};
  searchFilters["$and"] = [searchFilter];
  console.log("searchFilters", searchFilters);
  booking
    .aggregate([
      {
        $match: searchFilters,
      },
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

router.get("/bookingReview", async (req, res) => {
  let query = req.query;
  console.log("query", query);
  let searchFilter = {};
  if (query.user_id !== "") {
    searchFilter["user_id"] = parseInt(query.user_id);
  }
  if (query.phonenumber !== "" && query.phonenumber !== NaN) {
    searchFilter["phone"] = Number(query.phonenumber);
  }

  let searchFilters = {};
  searchFilters["$and"] = [searchFilter];
  console.log("searchFilters", searchFilters);
  user
    .aggregate([
      {
        $match: searchFilters,
      },
      // {
      //   $lookup: {
      //     from: "bookings",
      //     localField: "user_id",
      //     foreignField: "user_id",
      //     as: "bokingList",
      //   },
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

module.exports = router;
