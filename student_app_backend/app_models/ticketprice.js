const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  ticket_price_id: {
    type: Number,
  },
  title: {
    type: String,
  },
  board: {
    type: String,
  },
  ticket_price: {
    type: Number,
  },
  price_amount: {
    type: Number,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
  modified_on: {
    type: Date,
  },
});
autoIncrement.initialize(mongoose.connection);
creatSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "ticket_price_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("ticket_price", creatSchema);
