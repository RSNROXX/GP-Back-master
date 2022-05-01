const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AboutSchema = new Schema(
  {
    about: {
      type: String,
      required: true
    },
    drInfo: {
      type: String,
      required: true
    }
  },
  { collection: "about" }
);

module.exports = mongoose.model("about", AboutSchema);
