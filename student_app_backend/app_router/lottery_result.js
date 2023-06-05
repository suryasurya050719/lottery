const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const booking = require("../app_models/booking");
const referal = require("../app_models/referal");
const publishStatus = require("../app_models/publishedStatus");
const winning_data = require("../app_models/winning_Revords");
const publicestatuses = require("../app_models/publishedStatus");
const user = require("../app_models/user");
const wallet = require("../app_models/wallet");
const Transection = require("../app_models/transection");
const game = require("../app_models/game");
const config = require("../config/config");
const { query } = require("express");
// const { Notification } = require("../common/Notification");

router.get("/preview", async (req, res) => {
  try {
    console.log("jdfsdjkf", req.query);
    let data_num = req.query.resultData;
    console.log(
      "req.query.winning_number_letters",
      req.query.winning_number_letters
    );
    let winning_number_formation = await WinningNumberFormatter(
      req.query.winning_number_letters
    );
    // const cleanedStr = winning_number_formation.replace(/^{ '(.+)' }$/, "$1");
    console.log("cleanedStr", winning_number_formation);
    let winning_numbers = winning_number_formation;
    console.log("winning_numbers", winning_numbers);
    let date = req.query.date;
    let show = req.query.show;
    let gameName = req.query.game_name;
    let lessDate = new Date(date);
    let graterDate = new Date(date);
    var PriceDetails = [];
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
    await game
      .aggregate([
        {
          $match: {
            $and: [{ game_name: gameName }],
          },
        },
        {
          $lookup: {
            from: "boards",
            localField: "board_id.name",
            foreignField: "board_name",
            as: "brd",
          },
        },
      ])
      .then(async (data) => {
        console.log("data", data[0].brd);
        PriceDetails = await data[0].brd;
      });
    console.log("boardname", board_name);
    console.log("PriceDetails", PriceDetails);
    console.log("gameName", gameName, new Date(show), lessDate, graterDate);
    await booking
      .aggregate([
        {
          $match: {
            // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
            $and: [
              { game_name: gameName },
              { showTime: new Date(show) },
              // {
              //   created_on: {
              //     $gte: lessDate,
              //     $lte: graterDate,
              //   },
              // },
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
            refered_user_id: { $first: "$refered_user_id" },
            refered_role_id: { $first: "$refered_role_id" },
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
        console.log("booking data", data);
        var total = [];
        var total_price = 0;
        var total_refered_comission = 0;
        await booking
          .aggregate([
            {
              $match: {
                // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
                $and: [{ game_name: gameName }, { showTime: new Date(show) }],
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
            console.log("error", error);
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
          await data1.booking_data.forEach(async (data2) => {
            var price = 0;
            console.log("data2", data2);
            if (data2.board_name == config.one_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              //  let price= boardDetails.price_amount.reduce((obj,item)=>Object.assign(obj,{[item.name]:[item.price]}))
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
              console.log("price====>", PriceDetalsobject);
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
              console.log(
                "formation_data",
                formation_data,
                show_result_number,
                data2.ticket_count,
                show_result_number[0] == formation_data[0]
              );
              // for (i = 0; i < formation_data.length; i++) {
              if (show_result_number[0] == formation_data[0]) {
                console.log("dfsd");
                let name = PriceDetalsobject[config.first_price];
                console.log("name", name);
                let tprice = data2.ticket_count * name;
                console.log("1 digit ", tprice);
                userprice = userprice + tprice;

                price = price + tprice;
                console.log("1 digit ", tprice);
                console.log("userprice ", userprice);
                console.log("price", price);
              }
              // }
            } else if (data2.board_name == config.two_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              //  let price= boardDetails.price_amount.reduce((obj,item)=>Object.assign(obj,{[item.name]:[item.price]}))
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
              console.log("price====>", PriceDetalsobject);
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              console.log(
                "formation_data",
                formation_data,
                show_result_number,
                data2.show_result_number
              );
              if (show_result_number[0] == formation_data[0]) {
                console.log(
                  ">>>",
                  data2.ticket_count,
                  PriceDetalsobject,
                  config.first_price,
                  PriceDetalsobject[config.first_price]
                );
                let tprice = data2.ticket_count * PriceDetalsobject.first_price;
                userprice = userprice + tprice;

                price = price + tprice;
                console.log("1 digit ", tprice);
                console.log("userprice ", userprice);
                console.log("price", price);
              }
              // for (i = 0; i < formation_data.length; i++) {
              //   if (show_result_number[i] == formation_data[i]) {
              //     userprice = userprice + data2.first_price;
              //     price = price + data2.first_price;
              //     console.log("2 digit ", data2.first_price);
              //   }
              // }
            } else if (data2.board_name == config.three_half_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("3 half digit ", tprice);
            } else if (data2.board_name == config.three_full_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("3 full digit ", tprice);
            } else if (data2.board_name == config.box_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("box price ", tprice);
            } else if (data2.board_name == config.all_board_digit) {
              console.log("PriceDetails>>>>>>>>", PriceDetails);
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              console.log("boardDetails", boardDetails);
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
              let amount = await allBoards(
                data_num,
                show_result_number,
                PriceDetalsobject
              );
              // let amount = boardResult(
              //   formation_data,
              //   show_result_number,
              //   PriceDetalsobject
              // );
              console.log("amount", amount);
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("all board ", tprice);
            } else if (data2.board_name == config.four_digit) {
              console.log("data_num", data_num);
              console.log("winning_numbers", winning_numbers);
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              console.log(
                "formated data===>",
                formation,
                data_num,
                board_leters
              );
              console.log("JSON.parse(winning_numbers)", winning_numbers);
              let formation_data = await FourDateformation(
                JSON.parse(winning_numbers),
                formation
              );
              console.log(
                "formation_data",
                formation_data,
                show_result_number,
                PriceDetalsobject
              );
              let amount = boardResult(
                formation_data,
                show_result_number,
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("4 digits", tprice);
            }

            data2["lottery_price"] = price;
            console.log("userprice...<<<>>>", userprice);
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

          console.log("total_price....>>>>", total_price);
        }
        console.log("total_refered_comission", total_refered_comission);
        console.log("total", total);
        console.log("total_price", total_price);

        let results = {};
        results["data"] = data;
        results["overallTicket"] = total[0]?.totalTikect;
        results["overallTicetprice"] = total[0].total_price;
        results["overalluserprice"] = total_price;
        results["total_refered_comission"] = total_refered_comission;

        res.json({
          success: true,
          statuscode: 200,
          status: "preview create successfully",
          result: results,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  } catch (error) {
    console.log("error", error);
    res.json({
      success: true,
      statuscode: 200,
      status: "Failed",
      result: error,
    });
  }
});

router.get("/Published", async (req, res) => {
  try {
    console.log(" publis ===>", req.query);
    let data_num = req.query.resultData;
    let winning_number_formation = await WinningNumberFormatter(
      req.query.winning_number_letters
    );
    // const cleanedStr = winning_number_formation.replace(/^{ '(.+)' }$/, "$1");
    console.log("cleanedStr", winning_number_formation);
    let winning_numbers = winning_number_formation;
    console.log("winning_numbers", winning_numbers);
    let date = req.query.date;
    let show = req.query.show;
    let gameName = req.query.game_name;
    let lessDate = new Date(date);
    let graterDate = new Date(date);
    var PriceDetails = [];
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
    await game
      .aggregate([
        {
          $match: {
            $and: [{ game_name: gameName }],
          },
        },
        {
          $lookup: {
            from: "boards",
            localField: "board_id.name",
            foreignField: "board_name",
            as: "brd",
          },
        },
      ])
      .then(async (data) => {
        console.log("data", data[0].brd);
        PriceDetails = await data[0].brd;
      });
    console.log("boardname", board_name);
    // console.log("PriceDetails", PriceDetails);
    booking
      .aggregate([
        {
          $match: {
            // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
            $and: [
              { game_name: gameName },
              { showTime: new Date(show) },
              // {
              //   created_on: {
              //     $gte: lessDate,
              //     $lte: graterDate,
              //   },
              // },
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
            refered_user_id: { $first: "$refered_user_id" },
            refered_role_id: { $first: "$refered_role_id" },
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
        console.log("booking data", data);
        var total = [];
        var total_price = 0;
        var total_refered_comission = 0;
        await booking
          .aggregate([
            {
              $match: {
                // _id:mongoose.Types.ObjectId('6398a1ed77aa1806cf8851a5'),
                $and: [{ game_name: gameName }, { showTime: new Date(show) }],
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
            console.log("error", error);
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
          await data1.booking_data.forEach(async (data2) => {
            var price = 0;
            console.log("data2", data2);
            if (data2.board_name == config.one_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              //  let price= boardDetails.price_amount.reduce((obj,item)=>Object.assign(obj,{[item.name]:[item.price]}))
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
              console.log("price====>", PriceDetalsobject);
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
              console.log(
                "formation_data",
                formation_data,
                show_result_number,
                data2.ticket_count,
                show_result_number[0] == formation_data[0]
              );
              // for (i = 0; i < formation_data.length; i++) {
              if (show_result_number[0] == formation_data[0]) {
                console.log("dfsd");
                let name = PriceDetalsobject[config.first_price];
                console.log("name", name);
                let tprice = data2.ticket_count * name;
                console.log("1 digit ", tprice);
                userprice = userprice + tprice;

                price = price + tprice;
                console.log("1 digit ", tprice);
                console.log("userprice ", userprice);
                console.log("price", price);
              }
              // }
            } else if (data2.board_name == config.two_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              //  let price= boardDetails.price_amount.reduce((obj,item)=>Object.assign(obj,{[item.name]:[item.price]}))
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
              console.log("price====>", PriceDetalsobject);
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              let formation_data = Dateformation(
                formation,
                data_num,
                board_leters
              );
              console.log(
                "formation_data",
                formation_data,
                show_result_number,
                data2.show_result_number
              );
              if (show_result_number[0] == formation_data[0]) {
                console.log(
                  ">>>",
                  data2.ticket_count,
                  PriceDetalsobject,
                  config.first_price,
                  PriceDetalsobject[config.first_price]
                );
                let tprice = data2.ticket_count * PriceDetalsobject.first_price;
                userprice = userprice + tprice;

                price = price + tprice;
                console.log("1 digit ", tprice);
                console.log("userprice ", userprice);
                console.log("price", price);
              }
              // for (i = 0; i < formation_data.length; i++) {
              //   if (show_result_number[i] == formation_data[i]) {
              //     userprice = userprice + data2.first_price;
              //     price = price + data2.first_price;
              //     console.log("2 digit ", data2.first_price);
              //   }
              // }
            } else if (data2.board_name == config.three_half_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("3 half digit ", tprice);
            } else if (data2.board_name == config.three_full_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("3 full digit ", tprice);
            } else if (data2.board_name == config.box_digit) {
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("box price ", tprice);
            } else if (data2.board_name == config.all_board_digit) {
              console.log("PriceDetails>>>>>>>>", PriceDetails);
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              console.log("boardDetails", boardDetails);
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
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
              let amount = await allBoards(
                data_num,
                show_result_number,
                PriceDetalsobject
              );
              // let amount = boardResult(
              //   formation_data,
              //   show_result_number,
              //   PriceDetalsobject
              // );
              console.log("amount", amount);
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("all board ", tprice);
            } else if (data2.board_name == config.four_digit) {
              console.log("data_num", data_num);
              console.log("winning_numbers", winning_numbers);
              let boardDetails = await PriceDetails.find(
                (data) => data.board_name == data2.board_name
              );
              let PriceDetalsobject = Object.assign(
                {},
                ...boardDetails.price_amount.map((item) => ({
                  [item.name]: item.price,
                }))
              );
              let formation = data2.board_letter_formation;
              let board_leters = data2.board_letters;
              let show_result_number = data2.show_result_number;
              console.log(
                "formated data===>",
                formation,
                data_num,
                board_leters
              );
              let formation_data = await FourDateformation(
                JSON.parse(winning_numbers),
                formation
              );
              console.log(
                "formation_data",
                formation_data,
                show_result_number,
                PriceDetalsobject
              );
              let amount = boardResult(
                formation_data,
                show_result_number,
                PriceDetalsobject
              );
              let tprice = data2.ticket_count * amount;
              userprice = userprice + tprice;
              price = price + tprice;
              console.log("4 digits", tprice);
            }

            data2["lottery_price"] = price;
            console.log("userprice...<<<>>>", userprice);
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

          console.log("total_price....>>>>", total_price);
          // let date = toString();
          var dateObj = new Date(data1.showTime);
          dateObj.setUTCHours(dateObj.getUTCHours + 5);
          dateObj.setUTCMinutes(dateObj.getUTCMinutes + 30);
          console.log("newdate", newdate);
          var month = dateObj.getUTCMonth() + 1; //months from 1-12
          var day = dateObj.getUTCDate();
          var year = dateObj.getUTCFullYear();
          console.log("newdate", newdate);
          var newdate = year + "/" + month + "/" + day;
          // Notification(
          //   data1.user_id,
          //   `Result Published  ${data1.game_name} Show ${data1.showTime}`
          // );
          // if (total_price > 0) {
          //   Notification(data1.user_id, `Earned ${total_price} `);
          // }
        }
        console.log("total_refered_comission", total_refered_comission);
        console.log("total", total);
        console.log("total_price", total_price);
        let results = {};
        let bookingdata = await BookingUpdate(data);
        console.log(
          "req.query.winning_number_letters",
          JSON.parse(req.query.winning_number_letters)
        );
        results["winning_number_letters"] = JSON.parse(
          req.query.winning_number_letters
        );
        results["winning_number"] = data_num;
        results["game_name"] = gameName;
        results["data"] = bookingdata;
        results["show_details"] = show;
        results["overallTicket"] = total[0].totalTikect;
        results["overallTicetprice"] = total[0].total_price;
        results["overalluserprice"] = total_price;
        results["total_refered_comission"] = total_refered_comission;
        results["wining_booking"] = data;
        await WiningRecordsCreate(results);
        await published(req.query.unpublished_id);
        console.log("results.data", results.data);
        await results.wining_booking.forEach(async (bookdata) => {
          console.log("==============>>>>>>>>>>>>>", bookdata.userprice);
          let bookingwallet = await walletAdd(
            bookdata.user_id,
            bookdata.userprice,
            false,
            "price amount"
          );
          console.log("bookingwallet", bookingwallet);
        });
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
    console.log("new DAte", new Date());
    let newDAte = new Date();
    await newDAte.setUTCHours(newDAte.getUTCHours() + 5);
    await newDAte.setUTCMinutes(newDAte.getUTCMinutes() + 30);
    // let min = new Date().getMinutes();
    // let hours = new Date().getHours();
    // let closeTime = hours + ":" + min;
    // console.log("Date-->", new Date().toISOString().split("T")[0]);
    // console.log("closeTime-->", closeTime);
    console.log("newDAte", newDAte);
    let filterdata = {
      status: false,
      $and: [
        { closeShowTime: { $lte: new Date() } },
        { date: { $lte: newDAte.toISOString().split("T")[0] } },
      ],
      // date:
    };

    console.log("unpublish filterdata===>", JSON.stringify(filterdata));
    if (req.query.game_name !== "" || req.query.game_name !== null) {
      filterdata["game_name"] = req.query.game_name;
    }
    await publishStatus
      .find(filterdata)
      .then((data) => {
        console.log("data", data);
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

router.get("/publishedShow", async (req, res) => {
  try {
    console.log("data", req.query.game_name);
    let game_name = req.query.game_name;
    console.log("new DAte", req.query);
    let newDAte = new Date();
    await newDAte.setUTCHours(newDAte.getUTCHours() + 5);
    await newDAte.setUTCMinutes(newDAte.getUTCMinutes() + 30);
    let filterdata = {
      status: true,
      // date:
    };
    let createdOn = {};

    if (req.query.game_name == "" || req.query.game_name == null) {
      return res.json({
        success: true,
        data: {},
        statuscode: 200,
        status: "game name is required",
      });
    } else {
      filterdata["game_name"] = req.query.game_name;
    }
    if (req.query?.fromDate == "" || req.query?.fromDate == null) {
      return res.json({
        success: true,
        data: {},
        statuscode: 200,
        status: "from Date is required",
      });
    } else {
      createdOn["$gte"] = new Date(
        new Date(req.query.fromDate).setUTCHours(0, 0, 0)
      );
    }
    if (req.query?.toDate == "" || req.query?.toDate == null) {
      return res.json({
        success: true,
        data: {},
        statuscode: 200,
        status: "from Date is required",
      });
    } else {
      createdOn["$lte"] = new Date(
        new Date(req.query.toDate).setUTCHours(23, 59, 59)
      );
    }
    let objectLength = Object.keys(createdOn).length;
    console.log("objectLength", objectLength);
    if (objectLength > 0) {
      filterdata["created_on"] = createdOn;
    }
    console.log("createdOn", createdOn);
    console.log("unpublish filterdata===>", JSON.stringify(filterdata));
    await publishStatus
      .aggregate([
        {
          $match: filterdata,
        },
      ])
      .then((data) => {
        console.log("data", data);
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
    console.log("error", error);
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});
router.get("/MobilePublishedShow", async (req, res) => {
  try {
    console.log("data", req.query.game_name);
    let game_name = req.query.game_name;
    console.log("new DAte", req.query);
    let newDAte = new Date();
    await newDAte.setUTCHours(newDAte.getUTCHours() + 5);
    await newDAte.setUTCMinutes(newDAte.getUTCMinutes() + 30);
    let filterdata = {
      status: true,
      // date:
    };
    let createdOn = {};

    if (req.query.game_name == "" || req.query.game_name == null) {
      return res.json({
        success: true,
        data: {},
        statuscode: 200,
        status: "game name is required",
      });
    } else {
      filterdata["game_name"] = req.query.game_name;
    }
    // if (req.query?.fromDate == "" || req.query?.fromDate == null) {
    //   return res.json({
    //     success: true,
    //     data: {},
    //     statuscode: 200,
    //     status: "from Date is required",
    //   });
    // } else {
    //   createdOn["$gte"] = new Date(
    //     new Date(req.query.fromDate).setUTCHours(0, 0, 0)
    //   );
    // }
    // if (req.query?.toDate == "" || req.query?.toDate == null) {
    //   return res.json({
    //     success: true,
    //     data: {},
    //     statuscode: 200,
    //     status: "from Date is required",
    //   });
    // } else {
    //   createdOn["$lte"] = new Date(
    //     new Date(req.query.toDate).setUTCHours(23, 59, 59)
    //   );
    // }
    // let objectLength = Object.keys(createdOn).length;
    // console.log("objectLength", objectLength);
    // if (objectLength > 0) {
    //   filterdata["created_on"] = createdOn;
    // }
    // console.log("createdOn", createdOn);
    console.log("unpublish filterdata===>", JSON.stringify(filterdata));
    await publishStatus
      .aggregate([
        {
          $match: filterdata,
        },
      ])
      .then((data) => {
        console.log("data", data);
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
    console.log("error", error);
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
async function FourDateformation(obj, index) {
  const result = [];
  for (let i = 0; i < index[0].length; i++) {
    const letter = index[0][i];
    const value = obj[letter];
    result.push(value);
  }

  const str = await result.join("");
  const newStr = await [str];
  return newStr;
}
function boardResult(result, cus_data, data) {
  console.log("result data", result, cus_data, data);
  if (result[0] == cus_data[0]) {
    console.log("Matched for 1st Prize");
    return data[config.first_price] !== undefined
      ? data[config.first_price]
      : 0;
  } else if (
    String(result[0]).substring(1, result[0].length) ==
    String(cus_data[0]).substring(1, cus_data[0].length)
  ) {
    console.log("Matched for 2st Prize", data[config.second_price]);
    return data[config.second_price] !== undefined
      ? data[config.second_price]
      : 0;
  } else if (
    String(result[0]).substring(2, result[0].length) ==
    String(cus_data[0]).substring(2, cus_data[0].length)
  ) {
    console.log("Matched for 3st Prize");
    return data[config.third_price] !== undefined
      ? data[config.third_price]
      : 0;
  } else if (
    String(result[0]).substring(3, result[0].length) ==
    String(cus_data[0]).substring(3, cus_data[0].length)
  ) {
    console.log("Matched for 4st Prize");
    return data[config.fourth_price] !== undefined
      ? data[config.fourth_price]
      : 0;
  } else {
    console.log("No Prize");
    return 0;
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
function walletAdd(user_id, price, commission, reason) {
  let amount = wallet
    .findOneAndUpdate({ user_id: user_id }, { $inc: { current_amount: price } })
    .then(async (data) => {
      user.findOne({ role_id: 1 }).then(async (res) => {
        await transectiondetails(
          price,
          user_id,
          res.user_id,
          res.role_id,
          3,
          reason,
          "INC",
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
    status: "success",
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
async function allBoards(data, single, price) {
  console.log("data,single,price", data, single, price);
  // console.log("single",single)
  // let showDate=single[0]
  // console.log("showDate",showDate)
  for (i = 0; i < data.length; i++) {
    console.log("index", i);
    let element = data[i];
    console.log("element == single[0]", element, single);
    if (element == single) {
      console.log("price[config.first_price]", price[config.first_price]);
      return await price[config.first_price];
    } else if (i + 1 == data.length) {
      console.log("element", element);
      console.log("i+1==data.length", i + 1 == data.length);
      return 0;
    }
  }
}
async function WinningNumberFormatter(params) {
  const str = params;

  // Parse the string into a JavaScript object
  const obj = JSON.parse(str);

  // Get the sorted property names
  const sortedKeys = Object.keys(obj).sort();

  // Create a new object with the sorted properties
  const sortedObj = {};
  sortedKeys.forEach((key) => {
    sortedObj[key] = obj[key];
  });
  const jsonString = JSON.stringify(sortedObj);
  console.log("sortedObj", jsonString);
  return jsonString;
}
