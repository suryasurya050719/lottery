const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  instandFound_id: {
    type: Number,
  },
  instandFound_status: {
    type: Boolean,
    default:false
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
  field: "instandFound_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("instandFound", creatSchema);
