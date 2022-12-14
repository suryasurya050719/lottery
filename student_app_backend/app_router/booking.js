const express = require("express");
const router = express.Router();
const booking = require("../app_models/booking");
const user = require("../app_models/user");
const referals = require("../app_models/referal");

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
    }).catch((error)=>{
      res.json({
        success: false,
        statuscode: 202,
        status: error,
      })
    })
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
     }).catch((error)=>{
       res.json({
         success: false,
         statuscode: 202,
         status: error,
       })
     })
 } catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  })
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
    }).catch((error)=>{
      res.json({
        success: false,
        statuscode: 202,
        status: error,
      })
    })
 } catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  })
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
    }).catch((error)=>{
      res.json({
        success: false,
        statuscode: 202,
        status: error,
      })
    })
 } catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  })
 }
});

router.get("/singleuserRecord",async (req,res)=>{
try {
  let query = req.query;
  booking.find({user_id:query.user_id}).then((data)=>{
    res.json({
      success: true,
      data: data,
      statuscode: 200,
      status: "list create successfully",
    })
  }).catch((error)=>{
    res.json({
      success: false,
      statuscode: 202,
      status: error,
    })
  })
} catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  })
}
})
module.exports = router;
