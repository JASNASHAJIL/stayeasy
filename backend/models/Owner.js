const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ownerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "owner" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // new owners start as pending
  },
}, { timestamps: true });



ownerSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Owner", ownerSchema);
