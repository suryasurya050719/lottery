const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  share_account_id: {
    type: Number,
  },
  user_id: {
    type: Number,
  },
  account_type: {
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
  phon: {
    type: String,
  },
  enter_name: {
    type: String,
  },
  share_customer_type: {
    type: Boolean,
    default: false,
  },
  share_broker_type: {
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
  field: "share_account_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("share_account", creatSchema);
