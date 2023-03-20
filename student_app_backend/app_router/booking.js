const express = require("express");
const router = express.Router();
const booking = require("../app_models/booking");
const user = require("../app_models/user");
const referals = require("../app_models/referal");
const publishStatus = require("../app_models/publishedStatus");
const wallet = require("../app_models/wallet");
const Transection = require("../app_models/transection");

const { route } = require("./live_result");

router.post("/bookingCreate", async (req, res) => {
  try {
    let data = req.body;
    wallet
      .findOne({ user_id: data.user_id })
      .then(async (walletres) => {
        console.log("wallet records", walletres);
        console.log(
          "======>",
          walletres.current_amount > Number(data.total_price)
        );
        if (walletres.current_amount > Number(data.total_price)) {
          // console.log("data", data);
          let walletprice = walletdedection(
            data.user_id,
            Number(data.total_price)
          );
          console.log("wallet", walletprice);
          let preparedata = {
            user_id: data.user_id,
            game_id: data.game_id,
            game_name: data.game_name,
            showTime:data.showTime,
            closeShowTime:data.closeShowTime,
            phone: data.phone,
            booking_data: data.booking_data,
            total_price: data.total_price,
            total_ticket_count: data.total_ticket_count,
            created_on: new Date(),
          };
          let date = ISOtoLOCALDATE(new Date());
          console.log("date", date);
          console.log("preparedata", preparedata);
          //  console.log("preparedata", preparedata);
          // let newCloseDate = `${date}T${preparedata.closeShowTime}`;
          // let newShowDate = `${date}T${preparedata.showTime}`;
          // console.log("newDate", newCloseDate);
          // console.log("new Date()", new Date(newCloseDate));
          // let min = new Date(newDate).getMinutes();
          // let hours = new Date(newDate).getHours();
          // let closeTime = hours + ":" + min;
          console.log(">>>>", data.game_id,data.game_name,new Date(preparedata.showTime));
          publishStatus
            .find({
              game_id: data.game_id,
              game_name: data.game_name,
              showTime:  new Date(preparedata.showTime),
              date: date,
            })
            .then(async (data) => {
              console.log("data for checking", data);
              if (data.length == 0) {
                let prepare = {
                  game_id: preparedata.game_id,
                  game_name: preparedata.game_name,
                  showTime:  preparedata.showTime,
                  closeShowTime:  preparedata.closeShowTime,
                  status: false,
                  date: date,
                };
                // console.log("prepare data", prepare);
                let published = new publishStatus(prepare);
                await published.save().then((data) => {
                  console.log("data for publice", data);
                });
              }
            }).catch((error)=>{
              console.log("error",error)
            })
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
        } else {
          res.json({
            success: false,
            statuscode: 202,
            status: "insufficent fund",
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
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
    // console.log("query fpr getall", query.show_time[0]);

    let searchFilter = {};
    var board_filter_data = [];
    let created_on = {};
    if (query.user_id !== "" &&query.user_id !== undefined) {
      searchFilter["user_id"] = parseInt(query.user_id);
    }
    // if (query.phonenumber !== "" && query.phonenumber !== NaN) {
    //   searchFilter["phone"] = Number(query.phonenumber);
    // }
    if (query.fromdate !== "" &&query.fromdate !==undefined) {
      created_on["$gt"] = new Date(query.fromdate);
    }
    if (query.todate !== ""&&query.todate !== undefined) {
      created_on["$lt"] = new Date(query.todate);
    }
    if (query.game_name !== "" && query.game_name !== undefined) {
      searchFilter["game_name"] = query.game_name;
    }
    let length = Object.keys(created_on).length;
    if (length > 0) {
      searchFilter["created_on"] = created_on;
    }
    // if(show_time.length>0){

    // }
    // console.log(
    //   "query.show_time.length zdfvdz",
    //   query.show_time,
    //   typeof query.show_time,
    //   typeof query.board_name
    // );
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

router.get("/bookingList", async (req, res) => {
  try {
    // let query = req.query;
    let query = req.query;
    if (query.searchType == 2) {
      let date = ISOtoLOCALDATE(new Date());
      let lessDate = new Date(date);
      let graterDate = new Date(date);
      graterDate.setHours(graterDate.getHours() + 23);
      graterDate.setMinutes(graterDate.getMinutes() + 59);
      console.log("newDate", lessDate, graterDate);
      (query.fromdate = lessDate), (query.todate = graterDate);
    }
    console.log("query fpr getall", query);
    console.log("query fpr getall", query.show_time);
    let role_id = query.role_id;
    let show_time = query.show_time;
    let board_name = query.board_name;
    let fromdate = query.fromdate;
    let todate = query.todate;
    let game_name = query.game_name;
    let phonenumber = query.phonenumber;
    let user_id = query.user_id;
    let referal_user_id = query.referal_user_id;
    let bookingFilter = {};
    let referalFillter = {};
    let userFillter = {};
    var board_filter_data = [];
    let created_on = {};
    if (query.referal_user_id !== "") {
      referalFillter["refered_user_id"] = parseInt(referal_user_id);
    }
    if (query.role_id !== "") {
      referalFillter["refered_role_id"] = parseInt(role_id);
    }
    if (query.user_id !== "") {
      userFillter["user_id"] = parseInt(user_id);
    }
    if (query.phonenumber !== "") {
      userFillter["phone"] = parseInt(phonenumber);
    }
    // if (query.phonenumber !== "" && query.phonenumber !== NaN) {
    //   searchFilter["phone"] = Number(query.phonenumber);
    // }
    if (fromdate !== "") {
      created_on["$gt"] = new Date(fromdate);
    }
    if (todate !== "") {
      created_on["$lt"] = new Date(todate);
    }
    if (query.game_name !== "") {
      bookingFilter["game_name"] = game_name;
    }
    let length = Object.keys(created_on).length;
    if (length > 0) {
      bookingFilter["created_on"] = created_on;
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
        bookingFilter["showTime"] = { $in: query.show_time };
      } else {
        bookingFilter["showTime"] = { $in: query?.show_time?.split(",") };
      }
    }
    // console.log("searchFilters", searchFilter["show_time"]);
    if (query.board_name) {
      if (typeof query.board_name == "object") {
        // bookingFilter["booking_data.board_name"] = { $in: query.board_name };
        board_filter_data = query.board_name;
      } else {
        // bookingFilter["booking_data.board_name"] = {
        //   $in: query?.board_name?.split(","),
        // };
        board_filter_data = query?.board_name?.split(",");
      }
    }
    let bookingFilters = {};
    let referalFilters = {};
    let userFillters = {};
    bookingFilters["$and"] = [bookingFilter];
    referalFilters["$and"] = [referalFillter];
    userFillters["$and"] = [userFillter];
    console.log("bookingFilters", JSON.stringify(bookingFilters));
    console.log("referalFilters", JSON.stringify(referalFilters));
    console.log("userFillters", JSON.stringify(userFillters));

    console.log("board_filter_data", board_filter_data);
    let dbQuery = [
      {
        $match: referalFilters,
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "user_id",
          pipeline: [{ $match: userFillters }],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "user.user_id",
          foreignField: "user_id",
          pipeline: [
            {
              $match: bookingFilters,
            },
          ],
          as: "bookings",
        },
      },
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          refered_user_id: 1,
          refered_role_id: 1,
          created_on: 1,
          referal_id: 1,
          user: 1,
          bookings: {
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
                      input: "$bookings.booking_data",
                      as: "booking_data",
                      cond: {
                        $in: ["$$booking_data.board_name", board_filter_data],
                      },
                    },
                  }
                : 1,
            total_price: 1,
            total_ticket_count: 1,
            created_on: 1,
            booking_id: 1,
          },
        },
      },
    ];
    // console.log("dbQuery=-====>", JSON.stringify(dbQuery));
    referals
      .aggregate(dbQuery)

      .then((data) => {
        console.log("data", data);
        // for(i=0;i<data.length;i++){
        //   let singledata=data[i]
        //   singledata.booking_data.forEach((result)=>{

        //   })
        // }
        res.json({
          success: true,
          data: data,
          statuscode: 200,
          status: "list create successfully",
        });
      })
      .catch((error) => {
        console.log("error====", error);
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

router.get("/userBasedBookings", async (req, res) => {
  try {
    // let query = req.query;
    let query = req.query;
    if (query.searchType == 2) {
      let date = ISOtoLOCALDATE(new Date());
      let lessDate = new Date(date);
      let graterDate = new Date(date);
      graterDate.setHours(graterDate.getHours() + 23);
      graterDate.setMinutes(graterDate.getMinutes() + 59);
      console.log("newDate", lessDate, graterDate);
      (query.fromdate = lessDate), (query.todate = graterDate);
    }
    console.log("query fpr getall", query);
    console.log("query fpr getall", query.show_time);
    let role_id = query.role_id;
    let show_time = query.show_time;
    let board_name = query.board_name;
    let fromdate = query.fromdate;
    let todate = query.todate;
    let game_name = query.game_name;
    let phonenumber = query.phonenumber;
    let user_id = query.user_id;
    let referal_user_id = query.referal_user_id;
    let bookingFilter = {};
    let referalFillter = {};
    let userFillter = {};
    var board_filter_data = [];
    let created_on = {};
    if (query.referal_user_id !== "") {
      referalFillter["refered_user_id"] = parseInt(referal_user_id);
    }
    if (query.role_id !== "") {
      referalFillter["refered_role_id"] = parseInt(role_id);
    }
    if (query.user_id !== "") {
      userFillter["user_id"] = parseInt(user_id);
    }
    if (query.phonenumber !== "") {
      userFillter["phone"] = parseInt(phonenumber);
    }
    // if (query.phonenumber !== "" && query.phonenumber !== NaN) {
    //   searchFilter["phone"] = Number(query.phonenumber);
    // }
    if (fromdate !== "") {
      created_on["$gt"] = new Date(fromdate);
    }
    if (todate !== "") {
      created_on["$lt"] = new Date(todate);
    }
    if (query.game_name !== "") {
      bookingFilter["game_name"] = game_name;
    }
    let length = Object.keys(created_on).length;
    if (length > 0) {
      bookingFilter["created_on"] = created_on;
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
        bookingFilter["showTime"] = { $in: query.show_time };
      } else {
        bookingFilter["showTime"] = { $in: query?.show_time?.split(",") };
      }
    }
    // console.log("searchFilters", searchFilter["show_time"]);
    if (query.board_name) {
      if (typeof query.board_name == "object") {
        // bookingFilter["booking_data.board_name"] = { $in: query.board_name };
        board_filter_data = query.board_name;
      } else {
        // bookingFilter["booking_data.board_name"] = {
        //   $in: query?.board_name?.split(","),
        // };
        board_filter_data = query?.board_name?.split(",");
      }
    }
    let bookingFilters = {};
    let referalFilters = {};
    let userFillters = {};
    bookingFilters["$and"] = [bookingFilter];
    referalFilters["$and"] = [referalFillter];
    userFillters["$and"] = [userFillter];
    console.log("bookingFilters", JSON.stringify(bookingFilters));
    console.log("referalFilters", JSON.stringify(referalFilters));
    console.log("userFillters", JSON.stringify(userFillters));

    console.log("board_filter_data", board_filter_data);
    let dbQuery = [
      {
        $match: referalFilters,
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "user_id",
          pipeline: [{ $match: userFillters }],
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "user.user_id",
          foreignField: "user_id",
          pipeline: [
            {
              $match: bookingFilters,
            },
          ],
          as: "bookings",
        },
      },
      {
        $unwind: {
          path: "$bookings",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          // refered_user_id: { $first: '$refered_user_id' },
          // refered_role_id: { $first: '$refered_role_id' },
          // created_on: { $first: '$created_on' },
          // referal_id: { $first: '$referal_id' },
          // __v: { $first: '$__v' },
          // user: { $first: '$user' },
          // bookings: { $first: '$bookings' },
          totalTikect: { $sum: "$bookings.total_ticket_count" },
          total_price: { $sum: "$bookings.total_price" },
        },
      },
    ];
    // console.log("dbQuery=-====>", JSON.stringify(dbQuery));
    referals
      .aggregate(dbQuery)

      .then((data) => {
        console.log("data", data);
        var total = 0;
        data.forEach((data) => {
          total = total + data.total_price;
        });
        res.json({
          success: true,
          total: total,
          data: data,
          statuscode: 200,
          status: "list create successfully",
        });
      })
      .catch((error) => {
        console.log("error====", error);
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

function walletdedection(user_id, dec_amount) {
  let amount = wallet
    .findOneAndUpdate(
      { user_id: user_id },
      { $inc: { current_amount: -dec_amount } }
    )
    .then(async (data) => {
      user.findOne({ role_id: 1 }).then(async (res) => {
        await transectiondetails(
          dec_amount,
          user_id,
          res.user_id,
          res.role_id,
          3,
          "booking dedection amount",
          "DEC",
          false
        );
      });
    })
    .catch((error) => {
      console.log("error for wallet dedection", error);
    });
  console.log("amount", amount);
  return amount;
}
async function transectiondetails(
  amount,
  userid,
  tran_f_userid,
  tran_f_roleid,
  tran_t_roleid,
  reason,
  position,
  commission
) {
  var transectiondata = {
    amount: amount,
    user_id: userid,
    transection_from_userid: tran_f_userid,
    transection_from_roleid: tran_f_roleid,
    transection_to_userid: userid,
    transection_to_roleid: tran_t_roleid,
    transection_from_type: "Admin",
    transection_to_type: "Wallet",
    reason: reason,
    position: position,
    commission: commission,
  };
  let transection = await new Transection(transectiondata)
    .save()
    .catch((error) => {
      console.log("error for trtansection", error);
    });
  console.log("transection", transection);
}
module.exports = router;
