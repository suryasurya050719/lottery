const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  account_id: {
    type: Number,
  },
  user_id: {
    type: Number,
  },
  role_id: {
    type: Number,
  },
  type: {
    type: String,
  },
  account_number: {
    type: String,
  },
  account_name: {
    type: String,
  },
  bank_name: {
    type: String,
  },
  branch_name: {
    type: String,
  },
  ifsc_code: {
    type: String,
  },
  upi_id: {
    type: String,
  },
  phone: {
    type: Number,
  },
  name: {
    type: String,
  },
  customer_status: {
    type: Boolean,
    default: false,
  },
  broker_status: {
    type: Boolean,
    default: false,
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
  field: "account_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("accoount", creatSchema);
