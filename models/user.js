const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            email
          );
        },
        msg: "Please enter a valid email address",
      },
      uniqueCaseInsensitive: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "Minimum of 6 characters"],
    },

    passwordToken: String,

    admin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true },
  { collection: "users" }
);

UserSchema.plugin(uniqueValidator, { message: "Error: Email already exists" });
module.exports = mongoose.model("User", UserSchema);
