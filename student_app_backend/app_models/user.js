const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  user_id: {
    type: Number,
  },
  name: {
    type: String,
  },
  phone: {
    type: Number,
  },
  role_id: {
    type: Number,
  },
  isOtpVerify: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "A",
  },
  referal_code: {
    type: String,
  },
  otp: {
    type: Number,
  },
  password: {
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
  field: "user_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("user", creatSchema);
