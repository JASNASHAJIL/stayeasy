const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin"],
      default: "user",
    },

    // 🔑 Subscription
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionPlan: {
      type: String,
      enum: ["1_month", "6_months", "1_year", "5_years"],
    },
    subscriptionExpiry: {
      type: Date,
    },

    // 🔐 Forgot password
    resetOtp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

// 🔒 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
