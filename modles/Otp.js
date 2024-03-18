//dependencies
const mongoose = require('mongoose');

//OTP schema

const OtpSchema = new mongoose.Schema(
  {
    Otp: {
      type: Number,
      required: true,
      minLength: 4,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    expireIn: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Otp = mongoose.model('Otp', OtpSchema);

module.exports = Otp;
