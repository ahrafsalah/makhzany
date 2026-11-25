import { Router } from "express";
import mongoose from "mongoose";
import Item from "../models/Item.js";
import Move from "../models/Move.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { itemId, type } = req.query;
    const filter = {};

    if (itemId) filter.item = itemId;
    if (type && ["in", "out", "adjust"].includes(type)) {
      filter.type = type;
    }

    const moves = await Move.find(filter)
      .populate("item", "name sku unit category")
      .sort({ movedAt: -1, createdAt: -1 });

    res.json({
      status: "success",
      results: moves.length,
      data: moves
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemId, item: bodyItemId, type, quantity, reference, note, movedAt } = req.body;
    const targetItemId = itemId || bodyItemId;
    const qty = Number(quantity);

    if (!targetItemId || !type || Number.isNaN(qty) || qty < 0) {
      await session.abortTransaction();
      return res.status(400).json({
        status: "fail",
        message: "Valid itemId, type (in|out|adjust), and non-negative quantity are required"
      });
    }

    const item = await Item.findById(targetItemId).session(session);
    if (!item) {
      await session.abortTransaction();
      return res.status(404).json({ status: "fail", message: "Item not found" });
    }

    const previousQuantity = item.quantity;
    let newQuantity = previousQuantity;

    if (type === "in") {
      if (qty <= 0) {
        await session.abortTransaction();
        return res.status(400).json({ status: "fail", message: "Quantity must be greater than 0 for incoming stock" });
      }
      newQuantity = previousQuantity + qty;
    } else if (type === "out") {
      if (qty <= 0) {
        await session.abortTransaction();
        return res.status(400).json({ status: "fail", message: "Quantity must be greater than 0 for outgoing stock" });
      }
      if (previousQuantity < qty) {
        await session.abortTransaction();
        return res.status(400).json({
          status: "fail",
          message: `Insufficient stock. Available: ${previousQuantity}, Requested: ${qty}`
        });
      }
      newQuantity = previousQuantity - qty;
    } else if (type === "adjust") {
      newQuantity = qty;
    } else {
      await session.abortTransaction();
      return res.status(400).json({ status: "fail", message: "Invalid movement type" });
    }

    item.quantity = newQuantity;
    await item.save({ session });

    const [move] = await Move.create(
      [
        {
          item: item._id,
          type,
          quantity: qty,
          previousQuantity,
          newQuantity,
          reference: reference || "",
          note: note || "",
          movedAt: movedAt ? new Date(movedAt) : new Date()
        }
      ],
      { session }
    );

    await session.commitTransaction();

    const populatedMove = await Move.findById(move._id).populate("item", "name sku unit category");

    res.status(201).json({
      status: "success",
      data: {
        move: populatedMove,
        item
      }
    });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const move = await Move.findByIdAndDelete(req.params.id);
    if (!move) {
      return res.status(404).json({ status: "fail", message: "Move not found" });
    }
    res.json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
});

export default router;
