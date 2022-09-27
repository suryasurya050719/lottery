const express = require("express");
const router = express.Router();
const ticket_price = require("../app_models/ticketprice");

router.post("", async (req, res) => {
  let body = req.body;
  // console.log("data", body);
  let preparedata = {
    title: body.title,
    board: body.board,
    ticket_price: body.ticket_price,
    price_amount: body.price_amount,
  };
  let data = new ticket_price(preparedata);
  data.save().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      status: "create successfully",
    });
  });
});

router.get("", async (req, res) => {
  ticket_price.find().then((data) => {
    res.json({
      success: true,
      statuscode: 200,
      data: data,
      status: "list generate successfully",
    });
  });
});

router.delete("/:id", (req, res) => {
  let user_id = Number(req.params.id);
  console.log("gshdfashg", user_id);
  ticket_price.deleteOne({ ticket_price_id: user_id }).then((data) => {
    res.send({
      statuscode: 200,
      status: "delete successfully",
    });
  });
});

router.put("", async (req, res) => {
  let body = req.body;
  let ticket_price_id = body.ticket_price_id;
  let preparedata = {
    title: body.title,
    board: body.board,
    ticket_price: body.ticket_price,
    price_amount: body.price_amount,
  };
  ticket_price
    .findOneAndUpdate({ ticket_price_id: ticket_price_id }, preparedata, {
      new: true,
    })
    .then((data) => {
      res.json({
        success: true,
        statuscode: 200,
        status: "Board updated successfully",
      });
    });
});

module.exports = router;
