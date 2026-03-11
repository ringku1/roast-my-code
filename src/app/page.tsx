"use client";

import { useState, useRef } from "react";

const LANGUAGES = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go",
  "Rust", "PHP", "Ruby", "Swift", "Kotlin", "HTML/CSS", "SQL", "Bash",
];

const LEVELS = [
  { id: "mild", label: "Mild", emoji: "😅", desc: "Gentle ribbing" },
  { id: "medium", label: "Medium", emoji: "🔥", desc: "Savage but fair" },
  { id: "savage", label: "Savage", emoji: "💀", desc: "No mercy" },
];

export default function Home() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [level, setLevel] = useState("medium");
  const [roast, setRoast] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function handleRoast() {
    if (!code.trim()) return;
    setRoast("");
    setLoading(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, level }),
        signal: abortRef.current.signal,
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setRoast((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setRoast("Something went wrong. Try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function handleCopy() {
    if (roast) navigator.clipboard.writeText(roast);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            🔥 Roast My Code
          </h1>
          <p className="text-zinc-400 text-lg">
            We&apos;ll hurt your feelings <em>and</em> make you a better developer.
          </p>
        </div>

        {/* Language + Level */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm text-zinc-400 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm text-zinc-400 mb-1">Roast Level</label>
            <div className="flex gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  title={l.desc}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                    level === l.id
                      ? "bg-orange-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {l.emoji} {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Code input */}
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Paste your code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={14}
            placeholder="// Paste the code you want roasted here..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
          />
        </div>

        {/* Action button */}
        <button
          onClick={loading ? handleStop : handleRoast}
          disabled={!code.trim() && !loading}
          className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
            loading
              ? "bg-red-700 hover:bg-red-800 text-white"
              : "bg-orange-600 hover:bg-orange-500 text-white disabled:opacity-40 disabled:cursor-not-allowed"
          }`}
        >
          {loading ? "⛔ Stop the Roast" : "🔥 Roast Me"}
        </button>

        {/* Roast output */}
        {(roast || loading) && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-orange-400 font-bold text-lg">🎤 The Roast</h2>
              {roast && !loading && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition"
                >
                  Copy
                </button>
              )}
            </div>
            <div className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap font-mono">
              {roast}
              {loading && <span className="animate-pulse text-orange-400">▍</span>}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
