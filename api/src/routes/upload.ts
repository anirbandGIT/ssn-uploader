import { Router } from "express";
import { upload } from "../middlewares";
import { validateFile } from "../utils";
import { uploadSingleFile } from "../services";

const router = Router();

router.post("/single", upload.single("file"), async (req, res, next) => {
  try {
    const file = req.file;
    const { personId, type } = req.body;

    if (!file) throw new Error("File missing");

    validateFile(file);

    const result = await uploadSingleFile({
      file,
      personId,
      type,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
