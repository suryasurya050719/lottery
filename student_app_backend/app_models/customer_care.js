const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  customer_care_id: {
    type: Number,
  },
  user_id: {
    type: Number,
  },
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
  file_name: {
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
  field: "customer_care_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("customer_care", creatSchema);
