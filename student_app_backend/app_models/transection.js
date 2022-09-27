const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const transectionSchema = mongoose.Schema({
  transection_id: {
    type: Number,
    default: 0,
  },
  user_id: {
    type: Number,
  },
  amount: {
    type: Number,
  },
  position: {
    type: String,
  },
  transection_from_userid: {
    type: Number,
  },
  transection_from_type: {
    type: String,
  },
  transection_to_userid: {
    type: Number,
  },
  transection_to_type: {
    type: String,
  },
  status: {
    type: String,
  },
  reason: {
    type: String,
  },
  TransectionStatus: {
    id: {
      type: Number,
    },
    customer_vpa: {
      type: String,
    },
    customer_name: {
      type: String,
    },
    txnAt: {
      type: String,
    },
    Merchand_Name: {
      type: String,
    },
    Merchand_upi_id: {
      trpe: String,
    },
  },

  created_on: {
    type: Date,
    default: Date.now,
  },
});
autoIncrement.initialize(mongoose.connection);
transectionSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "transection_id",
  startAt: 1,
  incrementBy: 1,
});
// const result = await creatSchema.createIndex(
//   { name: "text" },
//   { phone: "text" },
//   { gender: "text" },
//   { adout: "text" },
//   { email: "text" },
//   { course: "text" }
// );
module.exports = mongoose.model("transection", transectionSchema);
