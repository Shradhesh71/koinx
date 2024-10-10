import { Router } from "express";
import CryptoPrice from "../models/cryptoPrice.js";

const router = Router();

router.get("/", async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({
      type: "Failed",
      error: "Coin parameter is required, check the coin parameter.",
    });
  }

  try {
    // Find the latest data for the requested coin from the database
    const coinData = await CryptoPrice.findOne({ name: coin });

    if (!coinData) {
      return res.status(404).json({
        type: "Failed",
        error: `No data found for this ${coin}, Search this coins bitcoin, matic-network and ethereum`,
      });
    }

    // Send the latest cryptocurrency data as the response
    res.status(200).json({
      name: coinData.name,
      symbol: coinData.symbol,
      currentPriceUSD: coinData.currentPriceUSD,
      marketCapUSD: coinData.marketCapUSD,
      change24h: coinData.change24h,
      high_24h: coinData.high_24h,
      low_24h: coinData.low_24h,
      lastUpdated: new Date(coinData.lastUpdated).toLocaleString("en-US"),
    });
  } catch (error) {
    console.error("Error fetching cryptocurrency data: ", error);
    res.status(500).json({
      type: "Failed",
      error: "Internal server error, try after sometime later😓.",
    });
  }
});

export default router;
