const express = require("express");
const game = require("../app_models/game");
const router = express.Router();
// const game = require("../app_models/game");
const { route } = require("./live_result");

router.post("/creategame", async (req, res) => {
  let body = req.body;
  console.log("data", body);
  let data = {
    game_name: body.game_name,
    board_id: body.board_id,
    status: body.status,
    showCount: body.showCount,
    color: body.color,
    stacrt_date: body.stacrt_date,
    end_date: body.end_date,
    result_date: body.result_date,
  };
  let gameCreate = new game(data);
  gameCreate.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "game create successfully",
    });
  });
});

router.get("/getall", async (req, res) => {
  game.find().then(async (data) => {
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
  });
});

router.put("/updategame", async (req, res) => {
  let body = req.body;
  console.log("data", body);
  let board_id = body.game_id;
  let preparedata = {
    game_name: body.game_name,
    board_id: body.board_id,
    status: body.status,
    showCount: body.showCount,
    color: body.color,
    stacrt_date: body.stacrt_date,
    end_date: body.end_date,
    result_date: body.result_date,
  };
  game
    .findOneAndUpdate({ game_id: board_id }, preparedata, { new: true })
    .then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "game updated successfully",
      });
    });
});
router.delete("/gamedelete/:id", async (req, res) => {
  let game_id = req.params.id;
  game.deleteOne({ game_id: game_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "game delete successfully",
      data: data,
    });
  });
});

router.put("/publice", async (req, res) => {
  let body = req.body;
  console.log("body", body);
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
    });
});

router.get("/gameandboard", async (req, res) => {
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
    });
});

function TimeIncrement(date) {
  // date.setHours(date.getHours() + 5);
  // date.setMinutes(date.getMinutes() + 30);
  return date;
}
module.exports = router;
