"use client";

import { useState } from "react";
import { getMarketInsight } from "./actions";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await getMarketInsight(["BTC", "ETH"]);

      if (result.success) {
        setData(result);
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
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">Market Analysis</h2>
              <p className="text-sm text-neutral-400">
                Querying: BTC, ETH (24h)
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
                "Get Insights ($0.02)"
              )}
            </button>
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
                    {data.data.factors.map((factor: string, i: number) => (
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
