import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true
    },
    category: {
      type: String,
      default: "general",
      trim: true
    },
    unit: {
      type: String,
      default: "pcs",
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Quantity cannot be negative"]
    },
    minStock: {
      type: Number,
      default: 0,
      min: [0, "Minimum stock cannot be negative"]
    },
    costPrice: {
      type: Number,
      default: 0,
      min: [0, "Cost price cannot be negative"]
    },
    sellPrice: {
      type: Number,
      default: 0,
      min: [0, "Sell price cannot be negative"]
    },
    location: {
      type: String,
      default: "",
      trim: true
    },
    notes: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

itemSchema.index({ name: "text", sku: "text", category: "text" });

export default mongoose.model("Item", itemSchema);
