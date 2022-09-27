const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const walletSchema = mongoose.Schema({
  wallet_id: {
    type: Number,
    default: 0,
  },
  user_id: {
    type: Number,
  },
  current_amount: {
    type: Number,
  },
  Referal_amount_paid: {
    type: Boolean,
    default: false,
  },

  created_on: {
    type: Date,
    default: Date.now,
  },
});
autoIncrement.initialize(mongoose.connection);
walletSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "wallet_id",
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
module.exports = mongoose.model("wallet", walletSchema);
