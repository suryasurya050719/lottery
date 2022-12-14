const express = require("express");
const router = express.Router();
const board = require("../app_models/board");
const { route } = require("./live_result");

router.post("/boardCreate", async (req, res) => {
try {
  let data = req.body;
  console.log("data", data);
  let preparedata = {
    board_name: data.board_name,
    ticket_price: data.ticket_price,
    board_letters: data.board_letters,
    board_leter_format: data.board_leter_format,
    price_amount: data.price_amount,
  };
  let boardCrate = new board(preparedata);
  await boardCrate.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "Board create successfully",
    });
  }).catch((error)=>{
    res.json({
      success: false,
      statuscode: 202,
      status: error,
    });
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
    board.find().then((data) => {
      res.json({
        success: true,
        data: data,
        statuscode: 200,
        status: "Board create successfully",
      });
    }).catch((error)=>{
      res.json({
        success: false,
        statuscode: 202,
        status: error,
      });
    })
  } catch (error) {
    res.json({
      success: false,
      statuscode: 500,
      status: error,
    });
  }
});

router.put("/updateboard", async (req, res) => {
try {
  let data = req.body;
  console.log("data", data);
  let board_id = data.board_id;
  if (req.body.board_id == "") {
    res.json({
      success: false,
      statuscode: 202,
      status: "Board_id required",
    });
  }
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
    }).catch((error)=>{
      res.json({
        success: false,
        statuscode: 202,
        status: error,
      });
    })
} catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  });
}
});
router.delete("/boarddelete/:id", async (req, res) => {
try {
  if (req.params.id == "") {
    res.json({
      success: false,
      statuscode: 202,
      status: "Board_id required",
    });
  }
  let board_id = req.params.id;
  board.deleteOne({ board_id: board_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "board delete successfully",
      data: data,
    });
  }).catch((error)=>{
    res.json({
      success: false,
      statuscode: 202,
      status: error,
    });
  })
} catch (error) {
  res.json({
    success: false,
    statuscode: 500,
    status: error,
  });
}
});

module.exports = router;
