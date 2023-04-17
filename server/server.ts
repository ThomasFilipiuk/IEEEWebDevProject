import express from "express";
import cors from "cors";
import router from "./src/controllers/router";

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded());
app.use("/", router);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;