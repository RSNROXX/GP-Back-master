const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
  {
    serviceName: {
      type: String,
      required: true
    },
    serviceDescription: {
      type: String
    },
    imageUrl: {
      type: String
    }
  },
  { timestamps: true },
  { collection: "services" }
);

module.exports = mongoose.model("Service", ServiceSchema);
