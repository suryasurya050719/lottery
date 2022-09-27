const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const creatSchema = mongoose.Schema({
  ourinfo_id: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
  },

  information: {
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
  field: "ourinfo_id",
  startAt: 1,
  incrementBy: 1,
});

module.exports = mongoose.model("ourinfo", creatSchema);
