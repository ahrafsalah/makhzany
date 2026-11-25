import { Router } from "express";
import Setting from "../models/Setting.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ status: "success", data: settings });
  } catch (err) {
    next(err);
  }
});

router.put("/", async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ status: "success", data: settings });
  } catch (err) {
    next(err);
  }
});

export default router;
