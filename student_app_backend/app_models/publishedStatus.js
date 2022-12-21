const { type } = require("express/lib/response");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  published_id: {
    type: Number,
  },
  game_id: {
    type: Number,
  },
  game_name: {
    type: String,
  },
  showTime: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});
autoIncrement.initialize(mongoose.connection);
creatSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "published_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("publiceStatus", creatSchema);
