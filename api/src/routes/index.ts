import { Router } from "express";
import personRoutes from "./person.js";

const router = Router();

router.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

router.use("/persons", personRoutes);

export default router;
