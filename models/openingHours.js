const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OpeningHoursSchema = new Schema(
  {
    order: {
      type: String,
      required: true
    },
    dayOfTheWeek: {
      type: String,
      required: true
    },
    openingHours: {
      type: String,
      required: true
    }
  },
  { collection: "openingHours" }
);

module.exports = mongoose.model("openingHours", OpeningHoursSchema);
