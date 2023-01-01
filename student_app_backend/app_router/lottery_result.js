const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const booking = require("../app_models/booking");
const referal = require("../app_models/referal");
const publishStatus = require("../app_models/publishedStatus");
const winning_data = require("../app_models/winning_Revords");
const publicestatuses = require("../app_models/publishedStatus");

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
  if (req.query.board_name.length > 0) {
    board_name["booking_data.board_name"] = {
      $in:
        typeof req.query.board_name == "string"
          ? [req.query.board_name]
          : req.query.board_name,
    };
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
        $match: board_name,
      },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          game_id: { $first: "$game_id" },
          game_name: { $first: "$game_name" },
          phone: { $first: "$phone" },
          showTime: { $first: "$showTime" },
          published_status: { $first: "$published_status" },
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
          var price = 0;
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
                price = price + data2.first_price;
                console.log("1 digit ", data2.first_price);
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
            console.log("formation_data", formation_data);
            for (i = 0; i < formation_data.length; i++) {
              if (show_result_number[i] == formation_data[i]) {
                userprice = userprice + data2.first_price;
                price = price + data2.first_price;
                console.log("2 digit ", data2.first_price);
              }
            }
          } else if (data2.board_name == "3 digit half") {
            let formation = data2.board_letter_formation;
            let board_leters = data2.board_letters;
            let show_result_number = data2.show_result_number;
            let formation_data = Dateformation(
              formation,
              data_num,
              board_leters
            );
            let amount = boardResult(formation_data, show_result_number, data2);
            userprice = userprice + amount;
            price = price + amount;
            console.log("3 half digit ", amount);
          } else if (data2.board_name == "3 digit full") {
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
            let amount = boardResult(formation_data, show_result_number, data2);
            userprice = userprice + amount;
            price = price + amount;
            console.log("3 ful digit ", amount);
          } else if (data2.board_name == "box") {
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
            let amount = boardResult(formation_data, show_result_number, data2);
            userprice = userprice + amount;
            price = price + amount;
            console.log("box price ", amount);
          } else if (data2.board_name == "all board") {
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
            let amount = boardResult(formation_data, show_result_number, data2);
            userprice = userprice + amount;
            price = price + amount;
            console.log("all board ", amount);
          } else if (data2.board_name == "4 digit") {
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
            let amount = boardResult(formation_data, show_result_number, data2);
            userprice = userprice + amount;
            price = price + amount;
            console.log("4 digits", amount);
          }

          data2["lottery_price"] = price;
          console.log("price", price);
          console.log("data2 >>>>>>>>>>>>>>>>", data2);
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

router.get("/Published", async (req, res) => {
  try {
    console.log(" publis ===>", req.query);
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
    if (req.query.board_name.length > 0) {
      board_name["booking_data.board_name"] = {
        $in: req.query.board_name,
      };
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
          $match: board_name,
        },
        {
          $group: {
            _id: "$_id",
            user_id: { $first: "$user_id" },
            game_id: { $first: "$game_id" },
            game_name: { $first: "$game_name" },
            phone: { $first: "$phone" },
            showTime: { $first: "$showTime" },
            published_status: { $first: "$published_status" },
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
        console.log(" publis query data ===>", data);
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
            var price = 0;
            // console.log("data2", data2);
            if (data2.board_name == "1 Digit Board") {
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              console.log(
                "formated data===>",
                formation,
                data_num,
                board_leters
              );
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              console.log("formation_data", formation_data);
              for (i = 0; i < formation_data.length; i++) {
                if (show_result_number[i] == formation_data[i]) {
                  userprice = userprice + data2.first_price;
                  price = price + data2.first_price;
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
              console.log("formation_data", formation_data);
              for (i = 0; i < formation_data.length; i++) {
                if (show_result_number[i] == formation_data[i]) {
                  userprice = userprice + data2.first_price;
                  price = price + data2.first_price;
                }
              }
            } else if (data2.board_name == "3 digit half") {
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              let amount = boardResult(
                formation_data,
                show_result_number,
                data2
              );
              userprice = userprice + amount;
              price = price + amount;
            } else if (data2.board_name == "3 digit full") {
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              console.log(
                "formated data===>",
                formation,
                data_num,
                board_leters
              );
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              console.log("formation_data", formation_data);
              let amount = boardResult(
                formation_data,
                show_result_number,
                data2
              );
              userprice = userprice + amount;
              price = price + amount;
            } else if (data2.board_name == "box") {
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              console.log(
                "formated data===>",
                formation,
                data_num,
                board_leters
              );
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              console.log("formation_data", formation_data);
              let amount = boardResult(
                formation_data,
                show_result_number,
                data2
              );
              userprice = userprice + amount;
              price = price + amount;
            } else if (data2.board_name == "all board") {
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              console.log(
                "formated data===>",
                formation,
                data_num,
                board_leters
              );
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              console.log("formation_data", formation_data);
              let amount = boardResult(
                formation_data,
                show_result_number,
                data2
              );
              userprice = userprice + amount;
              price = price + amount;
            } else if (data2.board_name == "4 digit") {
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              console.log(
                "formated data===>",
                formation,
                data_num,
                board_leters
              );
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              console.log("formation_data", formation_data);
              let amount = boardResult(
                formation_data,
                show_result_number,
                data2
              );
              userprice = userprice + amount;
              price = price + amount;
            }

            data2["lottery_price"] = price;
            console.log("price", price);
            console.log("data2 >>>>>>>>>>>>>>>>", data2);
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
            let referedwallet = walletAdd(
              data2[0].refered_user_if,
              total_refered_comission,
              true
            );
            console.log("referedwallet", referedwallet);
          }
          data1["userprice"] = userprice;
          total_price = total_price + userprice;
          // total_refered_comission =
          //   total_refered_comission + (userprice * 5) / 100;
        }
        console.log("total_refered_comission", total_refered_comission);
        console.log("total", total);

        let results = {};
        let bookingdata = await BookingUpdate(data);
        bookingdata.forEach((bookdata) => {
          let bookingwallet = walletAdd(
            bookdata.user_id,
            bookdata.userprice,
            false
          );
          console.log("bookingwallet",bookingwallet)
        });
        results["data"] = bookingdata;
        results["overallTicket"] = total[0].totalTikect;
        results["overallTicetprice"] = total[0].total_price;
        results["overalluserprice"] = total_price;
        results["total_refered_comission"] = total_refered_comission;
        results["wining_booking"] = data;
        await WiningRecordsCreate(results);
        await published(req.query.unpublished_id);
        console.log(" publis end data ===>", results);

        res.json({
          success: true,
          statuscode: 200,
          status: "preview create successfully",
          result: results,
        });
      })
      .catch((error) => {
        console.log("error for then", error);
      });
  } catch (error) {
    console.log("error for try", error);
    res.json({
      success: false,
      statuscode: 500,
      result: error,
    });
  }
});

router.get("/unpublishedShow", async (req, res) => {
  try {
    console.log("data", req.query.game_name);
    let game_name = req.query.game_name;
    let min = new Date().getMinutes();
    let hours = new Date().getHours();
    let closeTime = hours + ":" + min;
    console.log("Date-->", new Date().toISOString().split("T")[0]);
    console.log("closeTime-->", closeTime);

    let filterdata = {
      status: false,
      $and: [
        { closeShowTime: { $lte: closeTime } },
        { date: { $lte: new Date().toISOString().split("T")[0] } },
      ],
      // date:
    };

    console.log("unpublish filterdata===>", filterdata);
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
  console.log("dateformation", con, assing, value);
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

function boardResult(result, cus_data, data) {
  console.log("result data", result, cus_data, data);
  if (result[0] == cus_data[0]) {
    console.log("Matched for 1st Prize");
    return data.first_price;
  } else if (
    String(result[0]).substring(1, result[0].length) ==
    String(cus_data[0]).substring(1, cus_data[0].length)
  ) {
    console.log("Matched for 2st Prize");
    return data.second_price;
  } else if (
    String(result[0]).substring(2, result[0].length) ==
    String(cus_data[0]).substring(2, cus_data[0].length)
  ) {
    console.log("Matched for 3st Prize");
    return data.third_price;
  } else if (
    String(result[0]).substring(3, result[0].length) ==
    String(cus_data[0]).substring(3, cus_data[0].length)
  ) {
    console.log("Matched for 4st Prize");
    return data.fourth_price;
  } else {
    console.log("No Prize");
  }
}

async function published(_id) {
  let res = await publicestatuses
    .findOneAndUpdate({ _id: _id }, { status: true }, { new: true })
    .catch((error) => {
      console.log("published", error);
    });
  console.log("published status update", res);
}

async function BookingUpdate(data) {
  let id = [];
  await data.forEach((data) => {
    id.push(mongoose.Types.ObjectId(data._id));
  });
  console.log("booking id", JSON.stringify(id));
  let res = await booking
    .updateMany({ _id: { $in: id } }, { published_status: true })
    .catch((error) => {
      console.log("error", error);
    });
  let res01 = await booking.find({ _id: { $in: id } }).catch((error) => {
    console.log("error", error);
  });
  return res01;
  // console.log("Booking updated data", res);
}

async function WiningRecordsCreate(data) {
  let records = new winning_data(data);
  let dataRecords = await records.save().catch((error) => {
    console.log("error", error);
  });
  console.log(" wining records create data", dataRecords);
}
function walletAdd(user_id, price, commission) {
  let amount = wallet
    .findOneAndUpdate({ user_id: user_id }, { $inc: { current_amount: price } })
    .then(async (data) => {
      user.findOne({ role_id: 1 }).then(async (res) => {
        await transectiondetails(
          res.user_id,
          "INC",
          price,
          "Admin",
          "Wallet",
          "Sucess",
          user_id,
          commission
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
  user_id,
  position,
  amount,
  tran_f_type,
  tran_t_type,
  status,
  tran_t_userid,
  commission
) {
  var transectiondata = {
    user_id: user_id,
    position: position,
    amount: amount,
    transection_from_userid: user_id,
    commission: commission,
    transection_to_userid: tran_t_userid,
    transection_from_type: tran_f_type,
    transection_to_type: tran_t_type,
    status: status,
  };

  let transection = await new Transection(transectiondata)
    .save()
    .catch((error) => {
      console.log("error for trtansection", error);
    });
  console.log("teansection", transection);
}
