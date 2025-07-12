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
  const [isManualControl, setIsManualControl] = useState(true); // Start in manual control mode
  const intervalRef = useRef(null);
  const chartContainerRef = useRef(null);
  const chartAreaRef = useRef(null);
  const [labelStyle, setLabelStyle] = useState({ top: 0, left: 0 });
  const LABEL_OFFSET = 48; // px above the line (ensures text is well above the line)

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

  // Animation sequence - disabled for manual control only
  useEffect(() => {
    if (data.length === 0) return; // Remove auto-animation completely
    // Only show background line initially
    setStage(1); // Always in bar stage for manual control
    setShowOverlay(false); // No overlay in manual mode
  }, [data]);

  // Handle slider change
  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setBarEndIndex(value);
    
    // Calculate maxY for the current position - allow it to decrease when moving backward
    const visible = data.slice(0, value);
    const localMax = Math.max(1, ...visible.map(d => d.birds_falling));
    setMaxY(localMax); // Always set to current max, allowing decrease
  };

  // Prepare chart data for current animation
  // Show all bars but with opacity based on whether they should be visible
  const animatedBar = data.map((d, index) => ({
    year: d.year,
    birds_falling: index < barEndIndex ? d.birds_falling : 0, // Set to 0 if beyond current position
    fill: d.year > 2025 ? MUSTARD : "#000", // All bars after 2025 are mustard yellow
    opacity: index < barEndIndex ? 0.8 : 0 // Hide bars beyond current position
  }));

  // Calculate label position whenever maxY or chart size changes
  useEffect(() => {
    if (!chartAreaRef.current) return;
    const chartRect = chartAreaRef.current.getBoundingClientRect();
    const chartHeight = chartRect.height;
    // The chart has a 40px top margin and 40px bottom margin
    const chartInnerHeight = chartHeight - 40 - 40;
    // Calculate the Y position of the background line in pixels (relative to chart area)
    // The line should always be at: 40 + chartInnerHeight * (1 - BACKGROUND_RATE / maxY)
    // The label should always be 48px above that, regardless of scaling
    const lineY = 40 + chartInnerHeight * (1 - BACKGROUND_RATE / maxY);
    const labelY = Math.max(0, lineY - 48); // Prevent going above the chart
    setLabelStyle({
      position: "absolute",
      left: 128,
      top: labelY,
      color: "#DDA0DD",
      fontSize: 16,
      fontWeight: 500,
      pointerEvents: "none"
    });
  }, [maxY, chartAreaRef.current]);

  // Slider and controls style
  const controlsStyle = {
    position: "fixed",
    top: 40,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "300px"
  };

  const sliderStyle = {
    width: "300px",
    height: "6px",
    borderRadius: "3px",
    background: "#ddd",
    outline: "none",
    WebkitAppearance: "none",
    cursor: "pointer"
  };

  // Find max y for fixed axis in stage 0
  const fixedYMin = 0.3; // never let y-axis go below this

  return (
    <div ref={chartContainerRef} style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, background: "#fff", zIndex: 0 }}>
      {/* Custom slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #000;
          cursor: pointer;
          border: none;
        }
      `}</style>
      

      
      {/* Minimalist slider at top */}
      <div style={controlsStyle}>
        <input
          type="range"
          min="0"
          max={data.length}
          value={barEndIndex}
          onChange={handleSliderChange}
          style={sliderStyle}
        />
      </div>

      <div ref={chartAreaRef} style={{ width: "100%", height: "100%", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={animatedBar} margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
            <XAxis dataKey="year" type="number" domain={["dataMin", 2200]} tickFormatter={y => y.toString()} stroke="#000" tick={{ fill: "#000" }}>
              <Label value="Year (25-year bins)" offset={-10} position="insideBottom" fill="#000" />
            </XAxis>
            <YAxis domain={[0, maxY]} stroke="#000" tick={{ fill: "#000" }}>
              <Label value="Extinctions" angle={-90} position="insideLeft" fill="#000" />
            </YAxis>
            <Tooltip />
            <Bar dataKey="birds_falling" isAnimationActive={false} fill="#000">
              {animatedBar.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.fill} opacity={entry.opacity} />
              ))}
            </Bar>
            {/* Overlay background extinction rate line */}
            <ReferenceLine y={BACKGROUND_RATE} stroke="#DDA0DD" strokeDasharray="4 4" strokeWidth={3} />
          </BarChart>
        </ResponsiveContainer>
        {/* Small purple text for background extinction rate */}
        <div style={labelStyle}>
          A normal background extinction rate is 1 species every 400 years. Or 0.25 species every 100 years.
        </div>
      </div>
    </div>
  );
} 