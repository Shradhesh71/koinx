import { Router } from "express";
import CryptoPrice from "../models/cryptoPrice.js";

const router = Router();

router.get("/", async (req, res) => {
  const { coin } = req.query;

  if (!coin) {
    return res.status(400).json({ error: "Coin parameter is required" });
  }

  try {
    const cryptoData = await CryptoPrice.findOne({ name: coin }).select(
      "HistoryPriceUSD"
    );

    if (!cryptoData || !cryptoData.HistoryPriceUSD.length) {
      return res
        .status(404)
        .json({ error: `No historical data found for ${coin}` });
    }

    const prices = cryptoData.HistoryPriceUSD;

    if (prices.length === 0) {
      return res.status(404).json({ error: `No data found for ${coin}` });
    }

    // Calculate the mean (average) of the prices
    const meanPrice =
      prices.reduce((sum, price) => sum + price, 0) / prices.length;

    // Calculate the standard deviation, first we find variance then standard deviation
    const variance =
      prices.reduce((sum, price) => sum + Math.pow(price - meanPrice, 2), 0) /
      prices.length;

    const stdDeviation = Math.sqrt(variance);

    // Send the standard deviation as the response
    res.status(200).json({ deviation: stdDeviation.toFixed(2) }); // Round to 2 decimal places
  } catch (error) {
    console.error(`Error calculating standard deviation for ${coin}: `, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
