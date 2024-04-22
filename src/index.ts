import express from "express";

import authorRouter from "./routes/author.router";
import bookRouter from "./routes/book.router";
import authRouter from "./routes/auth.router";

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/auth", authRouter);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" }).status(200);
});

app.listen(port, () => {
  console.log(`Server up and running on port: ${port}`);
});
