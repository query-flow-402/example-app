"use server";

import { QueryFlowClient } from "@queryflow-402/sdk";

export async function getMarketInsight(assets: string[] = ["BTC", "ETH"]) {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    return {
      success: false,
      error: "Server Error: Missing PRIVATE_KEY in .env.local",
    };
  }

  try {
    // 1. Initialize Client (Uses VPS URL by default)
    // Mode defaults to "signature", so we must explicitly enable "tx" for real payments
    const client = new QueryFlowClient(privateKey, { mode: "tx" });

    console.log("🤖 Querying Market Insights...");

    // 2. Perform Query
    const result = await client.market({
      assets,
      timeframe: "24h",
    });

    console.log("✅ Query Success:", result.sentiment.score);

    // 3. Return serializable data
    return {
      success: true,
      data: result,
      // lastTxHash is a public property on the client instance
      txHash: client.lastTxHash,
    };
  } catch (error) {
    console.error("SDK Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
