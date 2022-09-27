const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  board_id: {
    type: Number,
  },
  board_name: {
    type: String,
  },
  board_letters: Array,
  board_leter_format: Array,
  price_amount: Array,
  ticket_price: {
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
  field: "board_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("board", creatSchema);
