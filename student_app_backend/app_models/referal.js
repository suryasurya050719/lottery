const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const referalSchema = mongoose.Schema({
  referal_id: {
    type: Number,
    default: 0,
  },
  user_id: {
    type: Number,
  },
  refered_user_id: {
    type: Number,
  },
  refered_role_id: {
    type: Number,
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});
autoIncrement.initialize(mongoose.connection);
referalSchema.plugin(autoIncrement.plugin, {
  model: "post",
  field: "referal_id",
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
module.exports = mongoose.model("referal", referalSchema);
