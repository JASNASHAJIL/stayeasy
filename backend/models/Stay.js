const mongoose = require("mongoose");

const staySchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "any"], default: "any" },
  rent: { type: Number, required: true },
  address: { type: String, required: true },
  lat: { type: Number },
  lng: { type: Number },
  images: { type: [String], default: [] },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  approvedAt: { type: Date },
  rejectedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Stay", staySchema);
