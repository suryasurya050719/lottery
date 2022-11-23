const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  booking_id: {
    type: Number,
  },
  user_id: {
    type: Number,
  },
  role_id: {
    type: Number,
  },
  game_id: {
    type: Number,
  },
  game_name: {
    type: String,
  },
  phone: {
    type: Number,
  },
  booking_data: [
    {
      board_name: String,
      game_name: String,
      board_letters: Array,
      board_letter_formation: Array,
      show_result_number: Array,
      ticket_count: Number,
      ticket_number: Number,
      ticket_price: Number,
      total_price: Number,
    },
  ],
  total_price: {
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
  field: "booking_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("booking", creatSchema);
