import "dotenv/config";
import { connectDB } from "./config/db.js";
import Item from "./models/Item.js";
import Move from "./models/Move.js";
import Setting from "./models/Setting.js";

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  await Promise.all([Item.deleteMany({}), Move.deleteMany({}), Setting.deleteMany({})]);

  await Setting.create({
    warehouseName: "المخزن الرئيسي",
    currency: "EGP",
    lowStockAlert: true,
    allowNegativeStock: false,
    defaultUnit: "pcs"
  });

  const items = await Item.insertMany([
    {
      sku: "ITM-1001",
      name: "لابتوب Dell Latitude",
      category: "إلكترونيات",
      unit: "pcs",
      quantity: 12,
      minStock: 4,
      costPrice: 22000,
      sellPrice: 25500,
      location: "A1"
    },
    {
      sku: "ITM-1002",
      name: "طابعة ليزر HP",
      category: "إلكترونيات",
      unit: "pcs",
      quantity: 2,
      minStock: 3,
      costPrice: 6500,
      sellPrice: 7800,
      location: "A2"
    },
    {
      sku: "ITM-1003",
      name: "كرتونة ورق A4",
      category: "مستلزمات مكتبية",
      unit: "box",
      quantity: 35,
      minStock: 10,
      costPrice: 850,
      sellPrice: 1050,
      location: "B1"
    }
  ]);

  await Move.insertMany([
    {
      item: items[0]._id,
      type: "in",
      quantity: 12,
      previousQuantity: 0,
      newQuantity: 12,
      reference: "PO-001",
      note: "رصيد افتتاحي"
    },
    {
      item: items[1]._id,
      type: "out",
      quantity: 1,
      previousQuantity: 3,
      newQuantity: 2,
      reference: "SO-014",
      note: "صرف فرع"
    }
  ]);

  console.log("Seed completed successfully");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
