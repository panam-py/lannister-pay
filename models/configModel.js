const mongoose = require("mongoose");

const configSchema = mongoose.Schema({
  feeID: {
    type: String,
    required: [true, "Every configurstion spec must have a fee ID!"],
  },
  feeCurrency: {
    type: String,
    required: [true, "Every configurstion spec must have a fee currency!"],
  },
  feeLocale: {
    type: String,
    required: [true, "Every configurstion spec must have a fee locale!"],
  },
  feeEntity: {
    type: String,
    required: [true, "Every configurstion spec must have a fee entity!"],
  },
  entityProperty: {
    type: String,
    required: [true, "Every configurstion spec must have an entity property!"],
  },
  feeType: {
    type: String,
    required: [true, "Every configurstion spec must have a fee type!"],
  },
  feeValue: {
    type: String,
    required: [true, "Every configurstion spec must have an fee value!"],
  },
  score: {
    type: Number,
    default: 0,
  },
});

const Config = new mongoose.model("Config", configSchema);

module.exports = Config;
