import { Router } from "express";

import { createPerson } from "../services/person.js";
import { createPersonSchema } from "@repo/validation";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const parsed = createPersonSchema.parse(req.body);

    const result = await createPerson(parsed);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
