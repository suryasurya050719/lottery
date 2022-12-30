const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const Schema = mongoose.Schema({
  winning_id: {
    type: Number,
    default: 0,
  },
  overall_ticket: {
    type: Number,
  },
  overallTicetprice: {
    type: Number,
  },
  overalluserprice: {
    type: Number,
  },
  total_refered_comission: {
    type: Number,
  },
  wining_bookin: Array,
  created_on: {
    type: Date,
    default: Date.now,
  },
});
autoIncrement.initialize(mongoose.connection);
Schema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "winning_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("winningRecords", Schema);
