import mongoose from "mongoose";

const moveSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item reference is required"]
    },
    type: {
      type: String,
      enum: ["in", "out", "adjust"],
      required: [true, "Movement type is required"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"]
    },
    previousQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    newQuantity: {
      type: Number,
      required: true,
      min: 0
    },
    reference: {
      type: String,
      default: "",
      trim: true
    },
    note: {
      type: String,
      default: "",
      trim: true
    },
    movedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

moveSchema.index({ movedAt: -1 });

export default mongoose.model("Move", moveSchema);
