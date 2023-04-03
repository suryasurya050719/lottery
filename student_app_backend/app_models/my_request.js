const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  withdraw_id: {
    type: Number,
  },
  user_id: {
    type: Number,
  },
  role_id: {
    type: Number,
  },
  account_type: {
    type: String,
  },
  account_details: {
    type: String,
  },
  user_name: {
    type: String,
  },
  title: {
    type: String,
  },
  details: {
    type: String,
  },
  amount: {
    type: Number,
  },

  phone: {
    type: Number,
  },
  file_name: {
    type: String,
  },
  rejected_reason: {
    type: String,
  },
  request_status: {
    type: Number,
    default: 1,
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
  field: "withdraw_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("withdraw", creatSchema);
