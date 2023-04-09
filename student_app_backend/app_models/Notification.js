const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  notification_id: {
    type: Number,
  },
  user_id: {
    type: Number,
  },
  user_name: {
    type: String,
  },
  message: {
    type: String,
  },
  message_status:{
    type:Boolean,
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
  field: "notification_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("notification", creatSchema);
