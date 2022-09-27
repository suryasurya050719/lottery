const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  game_id: {
    type: Number,
  },
  board_id: {
    type: Number,
  },
  game_name: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  showCount: {
    type: Number,
  },
  stacrt_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  result_date: {
    type: Date,
  },
  color: {
    type: String,
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
  field: "game_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("game", creatSchema);
