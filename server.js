import express from "express";
import dotenv from "dotenv";
import { connect } from "./config/connect.js";
dotenv.config();
import "./controllers/fetchCryptoPrices.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connect();

// routes
import stats from "./routes/stats.js";
import deviation from "./routes/deviation.js";

app.get("/", (req, res) => {
  res.send("Wohoo, backend is live now!!!");
});

app.use("/stats", stats);
app.use("/deviation", deviation);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});
