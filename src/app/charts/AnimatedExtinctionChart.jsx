"use client";
import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, ReferenceLine } from "recharts";
import * as d3 from "d3-fetch";

const BACKGROUND_RATE = 0.25; // 1 species every 400 years
const SPLIT_YEAR = 2025; // Now use 2025 as the present
const PAUSE_BETWEEN = 3000; // ms pause between stages
const ANIMATION_INTERVAL = 100; // ms per bin for animation (faster)
const MUSTARD = "#FFD600";

const EXPLANATIONS = [
  "Background extinction rate: the natural rate of bird extinctions (1 species every 400 years).",
  "Actual recorded and projected bird extinctions through history (100-year bins)."
];

function binData(rawData) {
  if (!rawData.length) return [];
  const minYear = Math.floor(rawData[0].year / 25) * 25;
  const splitYear = SPLIT_YEAR; // 2025
  const bins = [];
  // Black bins: up to and including SPLIT_YEAR (25-year bins)
  for (let y = minYear; y <= splitYear; y += 25) {
    bins.push({ year: y, birds_falling: 0 });
  }
  // Yellow bins: 2026–2199 (25-year bins)
  for (let y = 2050; y <= 2175; y += 25) {
    bins.push({ year: y, birds_falling: 0 });
  }
  rawData.forEach(d => {
    if (d.year <= splitYear) {
      const binIdx = Math.floor((d.year - minYear) / 25);
      bins[binIdx].birds_falling += d.birds_falling;
    } else if (d.year < 2200) {
      // All years 2026–2199 go into 25-year yellow bins
      const yellowBinIdx = Math.floor((d.year - 2025) / 25) + Math.floor((splitYear - minYear) / 25) + 1;
      if (yellowBinIdx < bins.length) {
        bins[yellowBinIdx].birds_falling += d.birds_falling;
      }
    }
    // Ignore years 2200 and above (no last bin)
  });
  return bins;
}

export default function AnimatedExtinctionChart() {
  const [data, setData] = useState([]);
  const [barEndIndex, setBarEndIndex] = useState(0);
  const [stage, setStage] = useState(0); // 0: background, 1: animated bars
  const [showOverlay, setShowOverlay] = useState(true);
  const [maxY, setMaxY] = useState(1); // max y for axis, only increases
  const intervalRef = useRef(null);

  // Load and preprocess data
  useEffect(() => {
    d3.csv("/bird_extinction_with_prognosis.csv", d => ({
      year: +d.start_year,
      birds_falling: +d.birds_falling
    })).then(rawData => {
      const filtered = rawData.filter(d => d.year <= 2200);
      const binned = binData(filtered);
      setData(binned);
      setMaxY(1); // Start at 1
    });
  }, []);

  // Animation sequence
  useEffect(() => {
    if (data.length === 0) return;
    let timeout;
    if (stage === 0) {
      setShowOverlay(true);
      setBarEndIndex(0);
      setMaxY(1); // Reset to 1 for background only
      timeout = setTimeout(() => setStage(1), PAUSE_BETWEEN);
    } else if (stage === 1) {
      setShowOverlay(true);
      let i = barEndIndex;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        i++;
        setBarEndIndex(prev => {
          const next = prev + 1;
          // Find max of visible bars
          const visible = data.slice(0, next);
          const localMax = Math.max(1, ...visible.map(d => d.birds_falling));
          setMaxY(prevMax => (localMax > prevMax ? localMax : prevMax));
          if (next >= data.length) {
            clearInterval(intervalRef.current);
            setTimeout(() => setShowOverlay(false), PAUSE_BETWEEN);
            return data.length;
          }
          return next;
        });
      }, ANIMATION_INTERVAL);
      return () => clearInterval(intervalRef.current);
    }
    return () => clearTimeout(timeout);
  }, [data, stage]);

  // Prepare chart data for current animation
  const animatedBar = data.slice(0, barEndIndex).map(d => ({
    year: d.year,
    birds_falling: d.birds_falling,
    fill: d.year > SPLIT_YEAR ? MUSTARD : "#000"
  }));

  // Overlay style
  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.7)",
    zIndex: 10,
    pointerEvents: "none",
    opacity: showOverlay ? 1 : 0,
    transition: "opacity 0.8s"
  };

  // Find max y for fixed axis in stage 0
  const fixedYMin = 0.3; // never let y-axis go below this

  return (
    <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, background: "#fff", zIndex: 0 }}>
      {/* Storytelling overlay */}
      <div style={overlayStyle}>
        <div style={{ fontSize: "2rem", maxWidth: 600, textAlign: "center", color: "#222", fontWeight: 600, textShadow: "0 2px 8px #fff" }}>
          {stage === 0 ? EXPLANATIONS[0] : EXPLANATIONS[1]}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={stage === 0 ? [] : animatedBar} margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
          <XAxis dataKey="year" type="number" domain={["dataMin", 2200]} tickFormatter={y => y.toString()}>
            <Label value="Year (25-year bins)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis domain={[0, maxY]}>
            <Label value="Birds Falling" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          {stage !== 0 && (
            <Bar dataKey="birds_falling" isAnimationActive={false} opacity={0.8}>
              {animatedBar.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          )}
          {/* Overlay background extinction rate line */}
          <ReferenceLine y={BACKGROUND_RATE} stroke="#888" strokeDasharray="4 4" strokeWidth={3} label={{ value: "Background extinction rate", position: "right", fill: "#888", fontWeight: 600, fontSize: 16 }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 