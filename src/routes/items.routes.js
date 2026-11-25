import { Router } from "express";
import Item from "../models/Item.js";
import Move from "../models/Move.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { search, category, lowStock } = req.query;
    const filter = {};

    if (category && category !== "all") {
      filter.category = category.trim();
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { sku: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ];
    }

    let items = await Item.find(filter).sort({ createdAt: -1 });

    if (lowStock === "true") {
      items = items.filter((item) => item.quantity <= item.minStock);
    }

    res.json({
      status: "success",
      results: items.length,
      data: items
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ status: "fail", message: "Item not found" });
    }
    res.json({ status: "success", data: item });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json({ status: "success", data: item });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) {
      return res.status(404).json({ status: "fail", message: "Item not found" });
    }
    res.json({ status: "success", data: item });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ status: "fail", message: "Item not found" });
    }

    if (req.query.cascadeMoves === "true") {
      await Move.deleteMany({ item: item._id });
    }

    res.json({ status: "success", data: null });
  } catch (err) {
    next(err);
  }
});

export default router;
