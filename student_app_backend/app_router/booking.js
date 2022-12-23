const express = require("express");
const router = express.Router();
const booking = require("../app_models/booking");
const user = require("../app_models/user");
const referals = require("../app_models/referal");
const publishStatus = require("../app_models/publishedStatus");

const { route } = require("./live_result");

router.post("/bookingCreate", async (req, res) => {
  try {
    let data = req.body;
    // console.log("data", data);
    let preparedata = {
      user_id: data.user_id,
      role_id: data.role_id,
      game_id: data.game_id,
      game_name: data.game_name,
      showTime: data.showTime,
      phone: data.phone,
      booking_data: data.booking_data,
      total_price: data.total_price,
      created_on: new Date(),
    };
    let date = ISOtoLOCALDATE(new Date());
    console.log("date", date);
    publishStatus
      .find({
        game_id: data.game_id,
        game_name: data.game_name,
        showTime: data.showTime,
        date: date,
      })
      .then(async (data) => {
        console.log("data for checking", data.length);
        if (data.length == 0) {
          let prepare = {
            game_id: preparedata.game_id,
            game_name: preparedata.game_name,
            showTime: preparedata.showTime,
            status: false,
            date: date,
          };
          let published = new publishStatus(prepare);
          await published.save().then((data) => {
            console.log("data for publice", data);
          });
        }
      });
    let boardCrate = new booking(preparedata);
    await boardCrate
      .save()
      .then((data) => {
        res.json({
          success: true,
          statuscode: 200,
          status: "Booking create successfully",
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

router.get("/getall", async (req, res) => {
  try {
    // let query = req.query;
    let query = req.query;
    console.log("query fpr getall", query);
    console.log("query fpr getall", query.show_time[0]);

    let searchFilter = {};
    var board_filter_data = [];
    let created_on = {};
    if (query.user_id !== "") {
      searchFilter["user_id"] = parseInt(query.user_id);
    }
    // if (query.phonenumber !== "" && query.phonenumber !== NaN) {
    //   searchFilter["phone"] = Number(query.phonenumber);
    // }
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
    // if(show_time.length>0){

    // }
    console.log(
      "query.show_time.length zdfvdz",
      query.show_time,
      typeof query.show_time,
      typeof query.board_name
    );
    if (query.show_time) {
      //   let data ={}
      //   data['$in']=query.showTime
      //   searchFilters["showTime"]=data
      if (typeof query.show_time == "object") {
        searchFilter["showTime"] = { $in: query.show_time };
      } else {
        searchFilter["showTime"] = { $in: query?.show_time?.split(",") };
      }
    }
    console.log("searchFilters", searchFilter["show_time"]);
    if (query.board_name) {
      if (typeof query.board_name == "object") {
        searchFilter["booking_data.board_name"] = { $in: query.board_name };
        board_filter_data = query.board_name;
      } else {
        searchFilter["booking_data.board_name"] = {
          $in: query?.board_name?.split(","),
        };
        board_filter_data = query?.board_name?.split(",");
      }
    }
    let searchFilters = {};
    searchFilters["$and"] = [searchFilter];
    console.log("searchFilters", JSON.stringify(searchFilters));
    console.log("board_filter_data", board_filter_data);
    let dbQuery = [
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
      {
        $project: {
          _id: 1,
          user_id: 1,
          game_id: 1,
          game_name: 1,
          phone: 1,
          showTime: 1,
          booking_data:
            board_filter_data.length > 0
              ? {
                  $filter: {
                    input: "$booking_data",
                    as: "booking_data",
                    cond: {
                      $in: ["$$booking_data.board_name", board_filter_data],
                    },
                  },
                }
              : 1,
          total_price: 1,
          created_on: 1,
          booking_id: 1,
          referalList: 1,
        },
      },
    ];
    console.log("dbQuery=-====>", JSON.stringify(dbQuery));
    booking
      .aggregate(dbQuery)

      .then((data) => {
        console.log("data", board_filter_data.length > 0, data);
        res.json({
          success: true,
          data: data,
          statuscode: 200,
          status: "list create successfully",
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
    console.log("error====>", error);
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.get("/bookingReview", async (req, res) => {
  try {
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
router.get("/referedbooking", async (req, res) => {
  try {
    let query = req.query;
    console.log("query", query);
    let searchFilter = {};
    let userFilter = {};
    if (query.user_id !== "") {
      searchFilter["user_id"] = parseInt(query.user_id);
    }
    if (query.refered_role_id !== "" && query.refered_role_id !== NaN) {
      searchFilter["refered_role_id"] = Number(query.refered_role_id);
    }
    if (query.referal_user_id !== "" && query.referal_user_id !== NaN) {
      searchFilter["refered_user_id"] = Number(query.referal_user_id);
    }
    if (query.phonenumber !== "" && query.phonenumber !== NaN) {
      userFilter["phone"] = Number(query.phonenumber);
    }
    userFilter["role_id"] = 3;

    let searchFilters = {};
    let userfilters = {};
    searchFilters["$and"] = [searchFilter];
    userfilters["$and"] = [userFilter];
    console.log("searchFilters", searchFilters);
    console.log("userfilters", userfilters);

    referals
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
            from: "users",
            localField: "user_id",
            foreignField: "user_id",
            pipeline: [
              {
                $match: userfilters,
              },
            ],
            as: "userlist",
          },
        },
        {
          $unwind: {
            path: "$userlist",
            preserveNullAndEmptyArrays: false,
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

router.get("/singleuserRecord", async (req, res) => {
  try {
    let query = req.query;
    booking
      .find({ user_id: query.user_id })
      .then((data) => {
        res.json({
          success: true,
          data: data,
          statuscode: 200,
          status: "list create successfully",
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
function ISOtoLOCALDATE(params) {
  date = new Date(params);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();

  if (dt < 10) {
    dt = "0" + dt;
  }
  if (month < 10) {
    month = "0" + month;
  }
  return year + "-" + month + "-" + dt;
}
module.exports = router;
