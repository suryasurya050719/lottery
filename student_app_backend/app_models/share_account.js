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
  account_name: {
    type: String,
  },
  account_number: {
    type: String,
  },
  branch_name: {
    type: String,
  },

  ifsc_code: {
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
  field: "share_account_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("share_account", creatSchema);
