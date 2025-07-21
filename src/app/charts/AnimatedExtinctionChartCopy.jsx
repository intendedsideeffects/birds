"use client";
import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label, ReferenceLine, ReferenceArea, CartesianGrid } from "recharts";
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
  // Use 20% opacity version of fill color for the separator
  let separatorColor = fill === MUSTARD
    ? 'rgba(255, 214, 0, 0.2)'
    : 'rgba(0, 0, 0, 0.2)';
  for (let i = 0; i < extinctions; i++) {
    segments.push(
      <rect
        key={i}
        x={x}
        y={y + i * segmentHeight}
        width={width}
        height={segmentHeight - 0.5}
        fill={fill}
        opacity={0.8}
        stroke={separatorColor}
        strokeWidth={1}
      />
    );
  }
  return <g>{segments}</g>;
}

// Helper to get a nice rounded value above the max
function getNiceYMax(max) {
  if (max <= 5) return 5;
  if (max <= 10) return 10;
  if (max <= 20) return 20;
  if (max <= 50) return 50;
  return Math.ceil(max / 10) * 10;
}

// Robust Y-axis tick generator: always round, even ticks
function getRobustYTicks(max) {
  if (max <= 2) {
    return [0, 0.5, 1, 1.5, 2];
  }
  if (max <= 10) {
    const step = 1;
    const upper = Math.ceil(max);
    const ticks = [];
    for (let v = 0; v <= upper; v += step) ticks.push(v);
    if (ticks[ticks.length - 1] < upper) ticks.push(upper);
    return ticks;
  }
  // For larger values, use powers of 10 or 5*10^n
  const pow10 = Math.pow(10, Math.floor(Math.log10(max)));
  let step = pow10;
  if (max / step < 2) step = step / 5; // e.g. 2000 max, step 500
  else if (max / step < 5) step = step / 2; // e.g. 300 max, step 50
  const upper = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = 0; v <= upper; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] < upper) ticks.push(upper);
  return ticks;
}

// Helper to get a simple step for Y-axis ticks
function getSimpleStep(max) {
  if (max <= 2) return 0.5;
  if (max <= 5) return 1;
  if (max <= 10) return 2;
  if (max <= 20) return 5;
  if (max <= 50) return 10;
  if (max <= 100) return 20;
  return 50;
}

function getSimpleYTicks(max) {
  const step = getSimpleStep(max);
  const ticks = [];
  for (let v = 0; v <= max; v += step) {
    ticks.push(Number(v.toFixed(2)));
  }
  if (ticks[ticks.length - 1] < max) ticks.push(Number(max.toFixed(2)));
  return ticks;
}

// Custom X axis tick to render short/long ticks attached to axis using viewBox
function CustomXAxisTick({ x, payload, viewBox }) {
  const isMajor = payload.value % 1000 === 0;
  const tickLength = isMajor ? 8 : 4;
  // Use the axis baseline from viewBox
  const axisY = viewBox ? viewBox.y + viewBox.height : 0;
  return (
    <g>
      <line
        x1={x}
        x2={x}
        y1={axisY - tickLength}
        y2={axisY}
        stroke="#000"
        strokeWidth={1}
        shapeRendering="crispEdges"
      />
      {isMajor && (
        <text x={x} y={axisY + 16} textAnchor="middle" fill="#000" fontSize={12}>
          {payload.value}
        </text>
      )}
    </g>
  );
}

// Custom Tooltip for the chart
function CustomTooltip({ active, payload, label, barEndIndex }) {
  if (!active || !payload || !payload.length) return null;
  const { year, birds_falling, index, dataLength } = payload[0].payload;
  if (!birds_falling || index === undefined || typeof barEndIndex !== 'number' || index >= barEndIndex) return null;
  const showRate = birds_falling > 1;
  const x = (0.55 * birds_falling).toFixed(1);
  const isPrognosis = index === (dataLength - 1);
  return (
    <div style={{
      background: isPrognosis ? 'rgba(255,214,0,0.8)' : 'white',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '10px 16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
      fontSize: 15,
      lineHeight: 1.5,
      color: isPrognosis ? '#000' : '#222',
      minWidth: 180,
      opacity: 0.9
    }}>
      <div><strong>Year:</strong> {year}</div>
      <div><strong>Extinctions:</strong> {birds_falling}</div>
      {showRate && (
        <div style={{marginTop: 8, color: isPrognosis ? '#000' : '#000', opacity: 0.9}}>
          {isPrognosis
            ? <>The extinction rate is projected to be <strong>~{x}×</strong> higher than the natural background rate.</>
            : <>The extinction rate is <strong>~{x}×</strong> higher than the natural background rate.</>
          }
        </div>
      )}
    </div>
  );
}

export default function AnimatedExtinctionChartCopy({ barEndIndex, setMaxBarIndex }) {
  const marginLeft = 160; // Define at the top so it's available everywhere
  const [data, setData] = useState([]);
  // Remove internal barEndIndex state
  // const [barEndIndex, setBarEndIndex] = useState(0);
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
  const [showSmallText, setShowSmallText] = useState(false);
  useEffect(() => {
    if (barEndIndex === 0) {
      setShowSmallText(false);
    } else {
      setShowSmallText(true);
    }
    // Update maxY when barEndIndex or data changes
    const visible = data.slice(0, barEndIndex + 1);
    const localMax = Math.max(1, ...visible.map(d => d.birds_falling));
    setMaxY(localMax);
  }, [barEndIndex, data]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

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
      if (setMaxBarIndex) setMaxBarIndex(binned.length - 1);
    });
  }, [setMaxBarIndex]);

  // Animation sequence - disabled for manual control only
  useEffect(() => {
    if (data.length === 0) return; // Remove auto-animation completely
    // Only show background line initially
    setStage(1); // Always in bar stage for manual control
    setShowOverlay(false); // No overlay in manual mode
  }, [data]);

  // Remove internal slider and handler
  // Prepare chart data for current animation (stacked)
  const maxExtinctions = Math.max(0, ...data.map((d, i) => (i < barEndIndex ? d.birds_falling : 0)));
  const stackedData = transformForStackedBars(data, barEndIndex);

  // Calculate label position and size for the extinction rate box
  const [boxLabelStyle, setBoxLabelStyle] = useState({});
  useEffect(() => {
    if (!chartAreaRef.current) return;
    const chartRect = chartAreaRef.current.getBoundingClientRect();
    const chartHeight = chartRect.height;
    const chartWidth = chartRect.width;
    // Chart margins
    const marginTop = 40;
    const marginBottom = 40;
    const chartInnerHeight = chartHeight - marginTop - marginBottom;
    const chartInnerWidth = chartWidth - marginLeft - 40;
    // Y positions for the box (0.1 to 1.1 extinctions)
    const y1 = marginTop + chartInnerHeight * (1 - 1.1 / maxY);
    const y2 = marginTop + chartInnerHeight * (1 - 0.1 / maxY);
    // Box height and width
    const boxHeight = y2 - y1;
    const boxWidth = chartInnerWidth;
    // Font size: large at start, shrinks with slider, min 18px
    const minFont = 18;
    const maxFont = 36;
    let fontSize, left, top, textAlign;
    if (barEndIndex === 0) {
      // Centered in the box
      fontSize = maxFont;
      left = marginLeft + boxWidth / 2;
      top = y1 + boxHeight / 2 - maxFont / 2;
      textAlign = "center";
    } else {
      // Above the box, left-aligned, small, sticks to top-left of box
      fontSize = minFont;
      left = marginLeft + 8;
      top = y1 - fontSize - 8; // 8px above the box
      textAlign = "left";
    }
    setBoxLabelStyle({
      position: "absolute",
      left: left,
      top: top,
      color: "#C8B8D8",
      fontSize: fontSize,
      fontWeight: 400,
      zIndex: 100,
      pointerEvents: "none",
      opacity: 1,
      width: barEndIndex === 0 ? boxWidth : boxWidth / 2,
      transform: barEndIndex === 0 ? "translateX(-50%)" : "none",
      textAlign: textAlign,
      transition: "font-size 0.5s, top 0.5s, left 0.5s, width 0.5s, transform 0.5s"
    });
  }, [barEndIndex, maxY, chartAreaRef.current]);

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
        color: "#C8B8D8",
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
    position: "absolute",
    top: '40px',
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

  // Generate all bin ticks for the X axis
  const xTicks = [];
  for (let y = -5000; y <= 2200; y += 100) {
    xTicks.push(y);
  }

  // Annotation config
  const annotations = [
    { year: -1300, label: "Human settlement of islands" },
    { year: 1300, label: "European colonization" },
    { year: 2000, label: "Habitat destruction" },
  ];
  const minYear = -5000;
  const maxYear = 2200;
  const chartMarginLeft = 40; // matches BarChart left margin
  const chartMarginRight = 40; // matches BarChart right margin

  // Helper to get annotation visibility and position (now inside component)
  const getAnnotationPos = (annotationYear) => {
    if (!chartAreaRef.current || !data.length) return { x: 0, y: 0, barHeight: 0 };
    const chartRect = chartAreaRef.current.getBoundingClientRect();
    const chartWidth = chartRect.width;
    const chartHeight = chartRect.height;
    const marginTop = 100; // matches BarChart top margin
    const marginBottom = 160; // matches BarChart bottom margin
    const innerWidth = chartWidth - chartMarginLeft - chartMarginRight;
    const innerHeight = chartHeight - marginTop - marginBottom;
    // Find which bin this annotation year falls into
    const binIdx = data.findIndex(d => {
      // Each bin represents a 100-year period starting at d.year
      return annotationYear >= d.year && annotationYear < d.year + 100;
    });
    if (binIdx === -1) return { x: 0, y: 0, barHeight: 0 };
    const bin = data[binIdx];
    // Calculate x position for the CENTER of the bin/bar
    const binStartYear = bin.year;
    const binCenterYear = binStartYear + 50; // Center of 100-year bin
    const t = (binCenterYear - minYear) / (maxYear - minYear);
    const x = chartMarginLeft + t * innerWidth;
    // Find the bar's height for this bin (if visible)
    const bar = binIdx < barEndIndex ? bin : null;
    const maxBar = Math.max(0, ...data.slice(0, barEndIndex).map(d => d.birds_falling));
    const barHeight = bar && maxBar > 0 ? (bar.birds_falling / maxBar) * innerHeight : 0;
    // y: top of the bar (or x axis if bar is 0)
    const y = marginTop + innerHeight - (isNaN(barHeight) ? 0 : barHeight);
    return { x, y, barHeight };
  };

  // Format annotation label: two lines, capitalize only the first word
  function formatLabel(label) {
    // Split into two roughly equal lines by word count
    const words = label.split(' ');
    const mid = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, mid).join(' ');
    const secondLine = words.slice(mid).join(' ');
    // Capitalize only the first word of the label
    const capFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return (
      <>
        {capFirst(firstLine)}<br />{secondLine.toLowerCase()}
      </>
    );
  }

  return (
    <div ref={chartContainerRef} style={{ width: "100%", height: "750px", background: "transparent", zIndex: 0, position: "relative", marginTop: 'calc(48px + 1cm)' }}>
      {/* Removed unnecessary padding above chart area */}
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

      {/* Chart area */}
      <div ref={chartAreaRef} style={{ width: "100%", height: "calc(100% - 80px)", position: "relative", marginTop: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={
            data.map((d, i) => ({ ...d, birds_falling: i < barEndIndex + 1 ? d.birds_falling : 0, index: i, dataLength: data.length }))
          } margin={{ top: 40, right: 40, left: 40, bottom: 60 }}>
            {/* Add horizontal gridlines */}
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" vertical={false} />
            {/* Light purple, half-transparent box for extinction rate range */}
            <rect
              x={0}
              y={null} // Will be set by a custom layer
              width={"100%"}
              height={null}
              fill="#e4dee6"
              opacity={0.4}
              pointerEvents="none"
              style={{ zIndex: 1 }}
            />
            {/* Custom layer for the box using Recharts' <ReferenceArea> */}
            <ReferenceArea
              y1={0.1}
              y2={1.1}
              fill="#e5dfcc"
              fillOpacity={0.85}
              ifOverflow="extendDomain"
            />
            <XAxis
              dataKey="year"
              type="number"
              domain={[-5000, 2200]}
              tickFormatter={y => (y % 1000 === 0 ? y.toString() : '')}
              ticks={xTicks.filter(x => x % 1000 === 0)}
              stroke="#aaa"
              tick={{ fill: "#888", fontSize: 13 }}
              axisLine={{ stroke: '#e0e0e0', strokeWidth: 2 }}
              tickLine={{ stroke: '#e0e0e0', strokeWidth: 1 }}
              height={50}
            >
              <Label value="Year" position="insideRight" offset={-15} style={{ fill: '#888', fontSize: 13, fontWeight: 400, textAlign: 'right' }} />
            </XAxis>
            <YAxis
              domain={() => {
                const maxBar = Math.max(0, ...data.slice(0, barEndIndex + 1).map(d => d.birds_falling));
                const paddedMax = maxBar * 1.05;
                const ticks = getRobustYTicks(paddedMax);
                const maxTick = ticks[ticks.length - 1];
                return [0, maxTick];
              }}
              stroke="#aaa"
              tick={{ fill: "#888", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              width={80}
              interval={0}
              tickFormatter={value => {
                if (value >= 10) return Math.round(value);
                return value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
              }}
              // Add grid lines
              grid={{ stroke: '#e0e0e0', strokeDasharray: '3 3' }}
            >
              <Label value={'Extinctions per 100 Years'} position="top" offset={20} angle={0} style={{ fill: '#888', fontSize: 13, fontWeight: 400, textAlign: 'center' }} />
            </YAxis>
            <Tooltip content={<CustomTooltip barEndIndex={barEndIndex} />} />
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
          </BarChart>
        </ResponsiveContainer>
        {/* Move annotation labels below the x axis */}
        <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', pointerEvents: 'none', zIndex: 10 }}>
          {annotations.map(({ year, label }) => {
            const show = barEndIndex >= data.findIndex(d => d.year >= year);
            if (!show) return null;
            if (!chartAreaRef.current || !data.length) return null;
            const chartRect = chartAreaRef.current.getBoundingClientRect();
            const chartWidth = chartRect.width;
            const chartMarginLeft = 40;
            const chartMarginRight = 40;
            const minYear = -5000;
            const maxYear = 2200;
            const innerWidth = chartWidth - chartMarginLeft - chartMarginRight;
            // Find which bin this annotation year falls into
            const binIdx = data.findIndex(d => {
              return year >= d.year && year < d.year + 100;
            });
            if (binIdx === -1) return null;
            const bin = data[binIdx];
            const binStartYear = bin.year;
            const binCenterYear = binStartYear + 50;
            const t = (binCenterYear - minYear) / (maxYear - minYear);
            const x = chartMarginLeft + t * innerWidth;
            // Move lines 1cm up, annotations 3cm up
            const annotationTop = `calc(100% - 1.5cm)`;
            // Format label to max 3 rows
            function formatAnnotationLabel(text) {
              const words = text.split(' ');
              if (words.length <= 3) return [text];
              const lines = [];
              let line = '';
              for (let i = 0; i < words.length; i++) {
                if (lines.length === 2) {
                  // Last line: join the rest
                  lines.push(words.slice(i).join(' '));
                  break;
                }
                if (line.length + words[i].length + 1 > 16 && line.length > 0) {
                  lines.push(line);
                  line = words[i];
                } else {
                  line += (line ? ' ' : '') + words[i];
                }
              }
              if (line) lines.push(line);
              return lines;
            }
            return (
              <React.Fragment key={year}>
                {/* Vertical line from x axis up to top of annotation label */}
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    bottom: '1.5cm',
                    width: 0,
                    height: '1cm', // shorten at top
                    borderLeft: '1px solid #bbb',
                    opacity: 0.8,
                    zIndex: 9,
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: annotationTop,
                    transform: 'translateX(-50%)',
                    fontSize: 15,
                    color: '#111',
                    opacity: 0.8,
                    background: 'none',
                    padding: 0,
                    margin: 0,
                    whiteSpace: 'pre-line',
                    textAlign: 'center',
                    fontWeight: 400,
                    pointerEvents: 'none',
                  }}
                >
                  {formatAnnotationLabel(label).map((line, idx) => (
                    <div key={idx}>{line}</div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}