import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    warehouseName: {
      type: String,
      default: "المخزن الرئيسي",
      trim: true
    },
    currency: {
      type: String,
      default: "EGP",
      trim: true
    },
    lowStockAlert: {
      type: Boolean,
      default: true
    },
    allowNegativeStock: {
      type: Boolean,
      default: false
    },
    defaultUnit: {
      type: String,
      default: "pcs",
      trim: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
