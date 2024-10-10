import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";
import CryptoPrice from "../models/cryptoPrice.js";
dotenv.config();

const coinNames = ["bitcoin", "matic-network", "ethereum"];
const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY;

async function fetchCryptoData(coinName) {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coinName}?x_cg_demo_api_key=${COINGECKO_API_KEY}`;

    const response = await axios.get(url);
    const cryptoData = response.data;

    await CryptoPrice.findOneAndUpdate(
      { name: cryptoData.id },
      {
        name: cryptoData.id,
        symbol: cryptoData.symbol,
        currentPriceUSD: cryptoData.market_data.current_price.usd,
        marketCapUSD: cryptoData.market_data.market_cap.usd,
        change24h: cryptoData.market_data.price_change_percentage_24h,
        high_24h: cryptoData.market_data.high_24h.usd,
        low_24h: cryptoData.market_data.low_24h.usd,
        $push: { HistoryPriceUSD: { $each: [cryptoData.market_data.current_price.usd], $slice: -100 } },  // Append to array and keep last 100 records
        lastUpdated: Date.now(),
      },
      { upsert: true, new: true }
    );

    console.log("Cryptocurrency data updated successfully.");
  } catch (error) {
    console.error("Error fetching cryptocurrency data: ", error);
  }
}

// Function to iterate over all coin names and call fetchCryptoData
async function updateAllCoins() {
  for (const coinName of coinNames) {
    await fetchCryptoData(coinName);
  }
}

cron.schedule("0 */2 * * *", updateAllCoins); // This will run the job every 2 hours


// Run the job immediately when the script is started
updateAllCoins();
