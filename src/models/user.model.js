const mongoose = require("mongoose");
// schema for user model with desired fields
// checking whether email is an valid email
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!value.match(/^\S+@\S+\.\S+$/)) {
          throw new Error("Not a valid email");
        }
      },
    }
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);
module.exports = { User };
