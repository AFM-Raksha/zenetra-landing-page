"use client";

import { useState } from "react";

// Lets reviewers flip between two concepts for the stats band. Remove once one is chosen.
export default function StatsSwitch({ pillars, sentence }: { pillars: React.ReactNode; sentence: React.ReactNode }) {
  const [view, setView] = useState<"pillars" | "sentence">("pillars");
  return (
    <>
      <div className="stats-switch">
        <div className="seg" role="group" aria-label="Section layout">
          <button type="button" aria-pressed={view === "pillars"} onClick={() => setView("pillars")}>Layout A · Pillars</button>
          <button type="button" aria-pressed={view === "sentence"} onClick={() => setView("sentence")}>Layout B · Statement</button>
        </div>
      </div>
      {view === "pillars" ? pillars : sentence}
    </>
  );
}
