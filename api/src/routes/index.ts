import { Router } from "express";

import personRoutes from "./person";
import uploadRoutes from "./upload";

const router = Router();

router.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

router.use("/persons", personRoutes);
router.use("/upload", uploadRoutes);

export default router;
