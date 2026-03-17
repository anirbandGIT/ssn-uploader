import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "ssn-api",
  });
});

export default router;
