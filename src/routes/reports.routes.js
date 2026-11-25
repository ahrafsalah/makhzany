import { Router } from "express";
import Item from "../models/Item.js";
import Move from "../models/Move.js";

const router = Router();

router.get("/summary", async (req, res, next) => {
  try {
    const [items, recentMoves] = await Promise.all([
      Item.find(),
      Move.find().populate("item", "name sku unit").sort({ movedAt: -1, createdAt: -1 }).limit(15)
    ]);

    const totalItems = items.length;
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalCostValue = items.reduce((sum, item) => sum + item.quantity * item.costPrice, 0);
    const totalSellValue = items.reduce((sum, item) => sum + item.quantity * item.sellPrice, 0);
    const lowStockItems = items.filter((item) => item.quantity <= item.minStock);

    const categoryMap = new Map();
    for (const item of items) {
      const cat = item.category || "general";
      const current = categoryMap.get(cat) || {
        category: cat,
        itemsCount: 0,
        totalUnits: 0,
        costValue: 0
      };
      current.itemsCount += 1;
      current.totalUnits += item.quantity;
      current.costValue += item.quantity * item.costPrice;
      categoryMap.set(cat, current);
    }

    res.json({
      status: "success",
      data: {
        totalItems,
        totalUnits,
        totalCostValue,
        totalSellValue,
        lowStockCount: lowStockItems.length,
        lowStockItems,
        byCategory: Array.from(categoryMap.values()),
        recentMoves
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
