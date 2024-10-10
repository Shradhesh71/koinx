import { Schema, model } from "mongoose";

const cryptoPriceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  currentPriceUSD: {
    type: Number,
    required: true,
  },
  marketCapUSD: {
    type: Number,
    required: true,
  },
  total_volume: {
    type: Number,
    required: true,
  },
  change24h: {
    type: Number,
    required: true,
  },
  price_change_percentage_24h: {
    type: Number,
    required: true,
  },
  price_change_24h_in_usd: {
    type: Number,
    required: true,
  },
  high_24h: {
    type: Number,
    required: true,
  },
  low_24h: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  HistoryPriceUSD: { type: [Number], default: [] },
});

const CryptoPrice = model("CryptoPrice", cryptoPriceSchema);

export default CryptoPrice;
