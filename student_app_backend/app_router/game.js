const express = require("express");
const game = require("../app_models/game");
const router = express.Router();
// const game = require("../app_models/game");
const { route } = require("./live_result");

router.post("/creategame", async (req, res) => {
  try {
    let body = req.body;
    // console.log("data", body);
    let data = {
      game_name: body.game_name,
      board_id: body.board_id,
      status: body.status,
      showCount: body.showCount,
      color: body.color,
      show_date: body.show_date,
      stacrt_date: body.stacrt_date,
      end_date: body.end_date,
      result_date: body.result_date,
    };
    await data.show_date.forEach(async (element) => {
      let date = ISOtoLOCALDATE(new Date());
      console.log("date", date);
      //  console.log("preparedata", preparedata);
      let newCloseDate = `${date}T${element.closeShowTime}:00.000Z`;
      let newShowDate = `${date}T${element.showTime}:00.000Z`;
      // const nDate = new Date(newCloseDate).toLocaleString("en-US", {
      //   timeZone: "Asia/Calcutta",
      // });
      console.log("nDate>>>>>>>>", JSON.stringify(newCloseDate));
      console.log("newShowDate>>>>>>>>", JSON.stringify(newShowDate));
      element.showTime = new Date(newShowDate);
      element.showTime.setHours(element.showTime.getHours() - 5);
      element.showTime.setMinutes(element.showTime.getMinutes() - 30);
      element.closeShowTime = new Date(newCloseDate);
      element.closeShowTime.setHours(element.closeShowTime.getHours() - 5);
      element.closeShowTime.setMinutes(element.closeShowTime.getMinutes() - 30);
      console.log("element", element);
    });
    console.log("data>>>>>>>>", JSON.stringify(data));
    let gameCreate = new game(data);
    gameCreate
      .save()
      .then((data) => {
        // Notification(
        //   data[0].user_id,
        //   `Sorry Your Request Rejected`
        // );
        res.json({
          success: true,
          statuscode: 200,
          status: "game create successfully",
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
    game
      .find()
      .then(async (data) => {
        await data.forEach((format) => {
          if (format.stacrt_date !== "") {
            format.startTime = TimeIncrement(format.stacrt_date);
          }
          if (format.end_date !== "") {
            format.endTime = TimeIncrement(format.end_date);
          }
          if (format.result_date !== "") {
            format.resultTime = TimeIncrement(format.result_date);
          }
        });
        await res.json({
          success: true,
          data: data,
          statuscode: 200,
          status: "game list successfully",
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

router.put("/updategame", async (req, res) => {
  try {
    let body = req.body;
    console.log("data", body);
    let board_id = body.game_id;
    if (board_id == "") {
      res.json({
        success: false,
        statuscode: 202,
        status: "game_id is required",
      });
    }
    let preparedata = {
      game_name: body.game_name,
      board_id: body.board_id,
      status: body.status,
      showCount: body.showCount,
      color: body.color,
      show_date: body.show_date,
      stacrt_date: body.stacrt_date,
      end_date: body.end_date,
      result_date: body.result_date,
    };
    await preparedata.show_date.forEach(async (element) => {
      let date = ISOtoLOCALDATE(new Date());
      console.log("date", date);
      //  console.log("preparedata", preparedata);
      let newCloseDate = `${date}T${element.closeShowTime}:00.000Z`;
      let newShowDate = `${date}T${element.showTime}:00.000Z`;
      // const nDate = new Date(newCloseDate).toLocaleString("en-US", {
      //   timeZone: "Asia/Calcutta",
      // });
      console.log("nDate>>>>>>>>", JSON.stringify(newCloseDate));
      console.log("newShowDate>>>>>>>>", JSON.stringify(newShowDate));
      element.showTime = new Date(newShowDate);
      element.showTime.setHours(element.showTime.getHours() - 5);
      element.showTime.setMinutes(element.showTime.getMinutes() - 30);
      element.closeShowTime = new Date(newCloseDate);
      element.closeShowTime.setHours(element.closeShowTime.getHours() - 5);
      element.closeShowTime.setMinutes(element.closeShowTime.getMinutes() - 30);
      console.log("element", element);
    });
    console.log("data>>>>>>>>", JSON.stringify(preparedata));
    game
      .findOneAndUpdate({ game_id: board_id }, preparedata, { new: true })
      .then((data) => {
        console.log("data",data)
        res.json({
          success: true,
          statuscode: 200,
          status: "game updated successfully",
        });
      })
      .catch((error) => {
        console.log("error",error)
        res.json({
          success: false,
          statuscode: 202,
          status: error,
        });
      });
  } catch (error) {
    console.log("error",error)
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});
router.delete("/gamedelete/:id", async (req, res) => {
  try {
    let game_id = req.params.id;
    if (req.params.id == "") {
      res.json({
        success: false,
        statuscode: 202,
        status: "game_id is required",
      });
    }
    game
      .deleteOne({ game_id: game_id })
      .then((data) => {
        res.send({
          statuscode: 200,
          status: "game delete successfully",
          data: data,
        });
      })
      .catch((error) => {
        res.json({
          success: false,
          statuscode: 500,
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

router.put("/publice", async (req, res) => {
  try {
    let body = req.body;
    console.log("body", body);
    // let game_id = req.params.id;
    if (body.game_id == "") {
      res.json({
        success: false,
        statuscode: 202,
        status: "game_id is required",
      });
    }
    let data = {
      game_id: body.game_id,
      status: body.status == true ? false : true,
    };
    console.log("bodatady", data);
    game
      .findOneAndUpdate(
        { game_id: data.game_id },
        { status: data.status },
        { new: true }
      )
      .then((data) => {
        console.log("data", data);
        res.send({
          statuscode: 200,
          status: "user updated successfully",
          data: data,
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

router.get("/gameandboard", async (req, res) => {
  try {
    game
      .aggregate([
        {
          $lookup: {
            from: "boards",
            localField: "board_id.name",
            foreignField: "board_name",
            as: "brd",
          },
        },
      ])
      .then((data) => {
        res.send({
          statuscode: 200,
          status: "user updated successfully",
          data: data,
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

function TimeIncrement(date) {
  // date.setHours(date.getHours() + 5);
  // date.setMinutes(date.getMinutes() + 30);
  return date;
}

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
