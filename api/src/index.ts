import express from "express";
import cors from "cors";

import routes from "./routes";
import { errorHandler } from "./middlewares";
import { env } from "./config";

// import { db } from "@repo/db";
import { minioClient } from "@repo/storage";
minioClient.listBuckets().then(console.log);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", routes);

// global error handler middleware
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
