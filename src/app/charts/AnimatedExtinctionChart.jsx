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
  const minYear = Math.floor(rawData[0].year / 100) * 100;
  const splitYear = SPLIT_YEAR; // 2025
  const bins = [];
  // Black bins: up to and including SPLIT_YEAR (100-year bins)
  for (let y = minYear; y <= splitYear; y += 100) {
    bins.push({ year: y, birds_falling: 0 });
  }
  // Yellow bins: 2026–2199 (100-year bins)
  for (let y = 2100; y <= 2199; y += 100) {
    bins.push({ year: y, birds_falling: 0 });
  }
  rawData.forEach(d => {
    if (d.year <= splitYear) {
      const binIdx = Math.floor((d.year - minYear) / 100);
      bins[binIdx].birds_falling += d.birds_falling;
    } else if (d.year < 2200) {
      // All years 2026–2199 go into 100-year yellow bins
      const yellowBinIdx = Math.floor((d.year - 2100) / 100) + Math.floor((splitYear - minYear) / 100) + 1;
      if (yellowBinIdx < bins.length) {
        bins[yellowBinIdx].birds_falling += d.birds_falling;
      }
    }
    // Ignore years 2200 and above (no last bin)
  });
  return bins;
}

// Helper to transform binned data for stacked bars
function transformForStackedBars(binned, barEndIndex) {
  // Find the max extinctions in any bin (for number of stacks)
  const maxExtinctions = Math.max(0, ...binned.map((d, i) => (i < barEndIndex ? d.birds_falling : 0)));
  // For each bin, create keys e0, e1, ..., eN for each extinction
  return binned.map((bin, i) => {
    const obj = { year: bin.year };
    for (let j = 0; j < (i < barEndIndex ? bin.birds_falling : 0); j++) {
      obj[`e${j}`] = 1;
    }
    return obj;
  });
}

// Custom shape for stacked bar segments
function StackedBarShape(props) {
  const { x, y, width, height, payload, fill } = props;
  const extinctions = Object.hasOwn(payload, 'birds_falling') ? payload.birds_falling : 0;
  if (!extinctions || height === 0) return null;
  const segmentHeight = height / extinctions;
  const segments = [];
  // Use 40% opacity version of fill color for the separator
  let separatorColor = fill === MUSTARD
    ? 'rgba(255, 214, 0, 0.4)'
    : 'rgba(0, 0, 0, 0.4)';
  for (let i = 0; i < extinctions; i++) {
    segments.push(
      <rect
        key={i}
        x={x}
        y={y + i * segmentHeight}
        width={width}
        height={segmentHeight - 0.5}
        fill={fill}
        stroke={separatorColor}
        strokeWidth={1}
      />
    );
  }
  return <g>{segments}</g>;
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
  const [showCenterText, setShowCenterText] = useState(true);
  const [centerTextStyle, setCenterTextStyle] = useState({});

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

  // Prepare chart data for current animation (stacked)
  const maxExtinctions = Math.max(0, ...data.map((d, i) => (i < barEndIndex ? d.birds_falling : 0)));
  const stackedData = transformForStackedBars(data, barEndIndex);

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

  // Offset for long and short text above the line
  const LONG_TEXT_OFFSET = 24;
  const SHORT_TEXT_OFFSET = 8;

  useEffect(() => {
    if (barEndIndex === 0) {
      setShowCenterText(true);
      setCenterTextStyle({
        position: "absolute",
        top: labelStyle.top - LONG_TEXT_OFFSET,
        left: labelStyle.left,
        color: "#DDA0DD",
        fontSize: 36,
        fontWeight: 400,
        zIndex: 100,
        pointerEvents: "none",
        opacity: 1,
        transition: "opacity 2.5s cubic-bezier(.77,0,.18,1)"
      });
    } else {
      setCenterTextStyle(prev => ({
        ...prev,
        opacity: 0,
        transition: "opacity 2.5s cubic-bezier(.77,0,.18,1)"
      }));
      setTimeout(() => setShowCenterText(false), 2500);
    }
  }, [barEndIndex, labelStyle.top, labelStyle.left]);

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
          <BarChart data={
            barEndIndex < data.length
              ? data.map((d, i) => (i < barEndIndex ? d : { ...d, birds_falling: 0 }))
              : data // Show all bars at the end
          } margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
            <XAxis dataKey="year" type="number" domain={["dataMin", 2200]} tickFormatter={y => y.toString()} stroke="#000" tick={{ fill: "#000" }}>
              <Label value="Year (100-year bins)" offset={-10} position="insideBottom" fill="#000" />
            </XAxis>
            <YAxis domain={[0, maxY]} stroke="#000" tick={{ fill: "#000" }}>
              <Label value="Extinctions" angle={-90} position="insideLeft" fill="#000" />
            </YAxis>
            <Tooltip />
            <Bar
              dataKey="birds_falling"
              isAnimationActive={false}
              opacity={0.8}
              shape={props => {
                // Use yellow for bars after 2025, black before
                const fill = props && props.payload && props.payload.year > 2025 ? MUSTARD : "#000";
                return <StackedBarShape {...props} fill={fill} />;
              }}
            />
            {/* Overlay background extinction rate line */}
            <ReferenceLine y={BACKGROUND_RATE} stroke="#DDA0DD" strokeDasharray="4 4" strokeWidth={3} />
          </BarChart>
        </ResponsiveContainer>
        {/* Show the long text above the line when barEndIndex == 0, otherwise show the short text with fade in/out */}
        {/* Both texts always rendered, with independent opacity and offset */}
        <div
          style={{
            position: "absolute",
            top: labelStyle.top - LONG_TEXT_OFFSET,
            left: labelStyle.left,
            color: "#DDA0DD",
            fontSize: 36,
            fontWeight: 400,
            zIndex: 100,
            pointerEvents: "none",
            opacity: barEndIndex === 0 ? 1 : 0,
            transition: "opacity 2.5s cubic-bezier(.77,0,.18,1)"
          }}
        >
          A normal background extinction rate is 1 species every 400 years. Or 0.25 species every 100 years.
        </div>
        <div
          style={{
            position: "absolute",
            top: labelStyle.top - SHORT_TEXT_OFFSET,
            left: labelStyle.left,
            color: "#DDA0DD",
            fontWeight: 400,
            fontSize: 20,
            zIndex: 100,
            pointerEvents: "none",
            opacity: barEndIndex > 0 ? 1 : 0,
            transition: "opacity 2.5s cubic-bezier(.77,0,.18,1)"
          }}
        >
          normal extinction rate
        </div>
      </div>
    </div>
  );
} 