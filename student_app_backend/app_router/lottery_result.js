const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const booking = require("../app_models/booking");
const referal = require("../app_models/referal");
const publishStatus = require("../app_models/publishedStatus");

router.get("/preview", async (req, res) => {
  console.log("jdfsdjkf", req.query);
  let data_num = req.query.resultData;
  let date = req.query.date;
  let show = req.query.show;
  let gameName = req.query.game_name;
  let lessDate = new Date(date);
  let graterDate = new Date(date);
  graterDate.setHours(graterDate.getHours() + 23);
  graterDate.setMinutes(graterDate.getMinutes() + 59);
  console.log("newDate", lessDate, graterDate);
  let board_name = {};
  if (req.query.board_name !== "") {
    board_name["booking_data.board_name"] = req.query.board_name;
  }
  console.log("boardname", board_name);
  booking
    .aggregate([
      {
        $match: {
          // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
          $and: [
            { game_name: gameName },
            { showTime: show },
            {
              created_on: {
                $gte: new Date(lessDate),
                $lte: new Date(graterDate),
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$booking_data",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $and: [board_name],
        },
      },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          game_id: { $first: "$game_id" },
          game_name: { $first: "$game_name" },
          phone: { $first: "$phone" },
          showTime: { $first: "$showTime" },
          booking_id: { $first: "$booking_id" },
          booking_data: { $push: "$booking_data" },
          ticket_price: { $first: "$booking_data.ticket_price" },
          totalTikect: { $sum: "$booking_data.ticket_count" },
          total_price: { $sum: "$booking_data.total_price" },
          created_on: { $first: "$created_on" },
        },
      },
    ])
    .then(async (data) => {
      console.log(data);
      var total = [];
      var total_price = 0;
      var total_refered_comission = 0;
      await booking
        .aggregate([
          {
            $match: {
              // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
              $and: [{ game_name: gameName }, { showTime: show }],
            },
          },
          {
            $unwind: {
              path: "$booking_data",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $group: {
              _id: "null",
              totalTikect: { $sum: "$booking_data.ticket_count" },
              total_price: { $sum: "$booking_data.total_price" },
            },
          },
        ])
        .then(async (result) => {
          console.log("result for totalcount===>", result);
          total = result;
        })
        .catch((error) => {
          res.json({
            success: false,
            statuscode: 202,
            status: error,
          });
        });
      console.log("data.length==>", data.length);
      for (let index = 0; index < data.length; index++) {
        let data1 = data[index];
        let userprice = 0;
        await data1.booking_data.forEach((data2) => {
          // console.log("data2", data2);
          if (data2.board_name == "1 Digit Board") {
            let formation = data2.board_letter_formation;
            let board_leters = data2.board_letters;
            let show_result_number = data2.show_result_number;
            console.log("formated data===>", formation, data_num, board_leters);
            let formation_data = Dateformation(
              formation,
              data_num,
              board_leters
            );
            console.log("formation_data", formation_data);
            for (i = 0; i < formation_data.length; i++) {
              if (show_result_number[i] == formation_data[i]) {
                userprice = userprice + data2.first_price;
              }
            }
          } else if (data2.board_name == "2 Digit Board") {
            let formation = data2.board_letter_formation;
            let board_leters = data2.board_letters;
            let formation_data = Dateformation(
              formation,
              data_num,
              board_leters
            );
          } else if (data2.board_name == "3 Digit Board Half") {
          } else if (data2.board_name == "3 Digit Board Full") {
          } else if (data2.board_name == "box") {
          } else if (data2.board_name == "all board") {
          } else if (data2.board_name == "4 Digit Board Full") {
          }
          data2["lottery_price"] = userprice;
        });
        let data2 = await referal.find({
          user_id: data1.user_id,
          refered_role_id: 2,
        });
        console.log("data for referal==>", data2.length);
        if (data2.length > 0) {
          console.log("entred");
          total_refered_comission =
            total_refered_comission + (userprice * 5) / 100;
          console.log("entred", total_refered_comission);
        }
        data1["userprice"] = userprice;
        total_price = total_price + userprice;
        // total_refered_comission =
        //   total_refered_comission + (userprice * 5) / 100;
      }
      console.log("total_refered_comission", total_refered_comission);
      console.log("total", total);

      let results = {};
      results["data"] = data;
      results["overallTicket"] = total[0].totalTikect;
      results["overallTicetprice"] = total[0].total_price;
      results["overalluserprice"] = total_price;
      results["total_refered_comission"] = total_refered_comission;

      res.json({
        success: true,
        statuscode: 200,
        status: "preview create successfully",
        result: results,
      });
    });
});

router.get("/unpublishedShow", async (req, res) => {
  try {
    console.log("data", req.query.game_name);
    let game_name = req.query.game_name;
    let filterdata = {
      status: false,
    };
    if (req.query.game_name !== "" || req.query.game_name !== null) {
      filterdata["game_name"] = req.query.game_name;
    }
    publishStatus
      .find(filterdata)
      .then((data) => {
        res.json({
          success: true,
          data: data,
          statuscode: 200,
          status: "Board create successfully",
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

module.exports = router;

function Dateformation(con, assing, value) {
  let result = con.map((item) => {
    return item
      .split("")
      .map((element) => {
        return assing[value.indexOf(element)];
      })
      .join("");
  });
  return result;
}
