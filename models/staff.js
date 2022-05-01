const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StaffSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    aboutText: {
      type: String
    },
    imageUrl: {
      type: String
    }
  },
  { timestamps: true },
  { collection: "staffs" }
);

module.exports = mongoose.model("Staff", StaffSchema);
