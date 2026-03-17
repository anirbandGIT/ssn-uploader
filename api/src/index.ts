import express from "express";
import cors from "cors";

import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/index.js";
import { env } from "./config/index.js";

// import { db } from "@repo/db";
import { minioClient } from "@repo/storage";
minioClient.listBuckets().then(console.log);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
