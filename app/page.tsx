"use client";

import { useState } from "react";
import { getMarketInsight, getPricePrediction } from "./actions";

type QueryType = "market" | "price";

type QueryResult = {
  success: true;
  data: {
    sentiment?: {
      score: number;
      trend: string;
      summary: string;
    };
    factors?: string[];
    prediction?: {
      targetPrice: number;
      confidence: number;
      direction: string;
    };
    context?: string;
    technicalAnalysis?: {
      rsi: number;
      support: number;
      resistance: number;
    };
  };
  txHash: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queryType, setQueryType] = useState<QueryType>("market");

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let result;
      if (queryType === "market") {
        result = await getMarketInsight(["BTC", "ETH"]);
      } else {
        result = await getPricePrediction("BTC");
      }

      if (result.success) {
        setData(result as QueryResult);
      } else {
        setError(result.error as string);
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-8">
      <main className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            QueryFlow SDK Demo
          </h1>
          <p className="text-neutral-400">
            Real Pay-Per-Query AI Insights (Powered by AVAX)
          </p>
        </header>

        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col gap-6">
            {/* Type Selection */}
            <div className="flex p-1 bg-neutral-800 rounded-lg self-start">
              <button
                onClick={() => {
                  setQueryType("market");
                  setData(null);
                  setError(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  queryType === "market"
                    ? "bg-neutral-700 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Market Analysis
              </button>
              <button
                onClick={() => {
                  setQueryType("price");
                  setData(null);
                  setError(null);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  queryType === "price"
                    ? "bg-neutral-700 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Price Prediction
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">
                  {queryType === "market"
                    ? "Market Analysis"
                    : "BTC Price Prediction"}
                </h2>
                <p className="text-sm text-neutral-400">
                  {queryType === "market"
                    ? "Querying: BTC, ETH (24h)"
                    : "Querying: BTC (7d Forecast)"}
                </p>
              </div>
              <button
                onClick={handleQuery}
                disabled={loading}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all transform active:scale-95 ${
                  loading
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Get Insights ($${queryType === "market" ? "0.02" : "0.03"})`
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg text-red-200 text-sm">
              🚨 Error: {error}
            </div>
          )}

          {data && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Payment Receipt */}
              <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-lg flex items-start gap-3">
                <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-green-400">
                    Payment Verified on Chain
                  </h3>
                  <a
                    href={`https://testnet.snowtrace.io/tx/${data.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-500/70 hover:text-green-400 underline decoration-dotted mt-1 block"
                  >
                    View Transaction ↗
                  </a>
                </div>
              </div>

              {/* AI Insight */}
              {queryType === "market" && data.data.sentiment ? (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium text-neutral-400">
                      Market Sentiment
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">
                        {data.data.sentiment.score}/100
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                          data.data.sentiment.trend === "bullish"
                            ? "bg-green-500/20 text-green-400"
                            : data.data.sentiment.trend === "bearish"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-neutral-500/20 text-neutral-400"
                        }`}
                      >
                        {data.data.sentiment.trend}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-300 leading-relaxed text-sm">
                    {data.data.sentiment.summary}
                  </div>

                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                      Key Factors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.data.factors?.map((factor: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-neutral-800 text-neutral-400 text-xs rounded border border-neutral-700"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : data.data.prediction && data.data.technicalAnalysis ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div>
                      <p className="text-sm font-medium text-neutral-400">
                        Target Price
                      </p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-bold text-white">
                          $
                          {data.data.prediction.targetPrice.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                        <span className="text-sm text-neutral-500">
                          (7 Days)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-400">
                        Confidence
                      </p>
                      <div className="flex items-center gap-2 mt-1 justify-end">
                        <span className="text-xl font-bold text-blue-400">
                          {data.data.prediction.confidence}%
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                            data.data.prediction.direction === "bullish"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {data.data.prediction.direction}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 text-neutral-300 leading-relaxed text-sm">
                    {data.data.context}
                  </div>

                  {/* Technical Analysis Pills */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="px-3 py-1.5 bg-neutral-900 rounded border border-neutral-800 flex flex-col">
                      <span className="text-[10px] text-neutral-500 uppercase">
                        RSI
                      </span>
                      <span className="text-sm font-mono font-medium">
                        {data.data.technicalAnalysis.rsi.toFixed(1)}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 bg-neutral-900 rounded border border-neutral-800 flex flex-col">
                      <span className="text-[10px] text-neutral-500 uppercase">
                        Support
                      </span>
                      <span className="text-sm font-mono font-medium">
                        ${data.data.technicalAnalysis.support.toLocaleString()}
                      </span>
                    </div>
                    <div className="px-3 py-1.5 bg-neutral-900 rounded border border-neutral-800 flex flex-col">
                      <span className="text-[10px] text-neutral-500 uppercase">
                        Resistance
                      </span>
                      <span className="text-sm font-mono font-medium">
                        $
                        {data.data.technicalAnalysis.resistance.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
