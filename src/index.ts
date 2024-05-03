import express from "express";

import authRouter from "./routes/auth.router";
import taskRouter from "./routes/task.router";
import * as path from "path";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use("/task", taskRouter);
app.use("/auth", authRouter);
app.use('/uploads', express.static(path.resolve('uploads')));

app.get("/ping", (req, res) => {
  res.json({ message: "pong" }).status(200);
});

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);
});
