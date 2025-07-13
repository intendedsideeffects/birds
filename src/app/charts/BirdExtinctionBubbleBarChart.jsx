"use client";
import React, { useState, useRef, useEffect } from "react";
import "./BubbleChart.css";
import * as d3 from "d3";

// Hardcoded data: [{ year, island, continental }]
const BAR_DATA = [
  { year: 1500, island: 5, continental: 0 },
  { year: 1525, island: 0, continental: 0 },
  { year: 1550, island: 0, continental: 0 },
  { year: 1575, island: 0, continental: 0 },
  { year: 1600, island: 5, continental: 0 },
  { year: 1625, island: 1, continental: 0 },
  { year: 1650, island: 4, continental: 0 },
  { year: 1675, island: 10, continental: 0 },
  { year: 1700, island: 1, continental: 0 },
  { year: 1725, island: 8, continental: 0 },
  { year: 1750, island: 8, continental: 0 },
  { year: 1775, island: 10, continental: 0 },
  { year: 1800, island: 5, continental: 0 },
  { year: 1825, island: 10, continental: 0 },
  { year: 1850, island: 13, continental: 0 },
  { year: 1875, island: 22, continental: 0 },
  { year: 1900, island: 17, continental: 3 },
  { year: 1925, island: 17, continental: 3 },
  { year: 1950, island: 17, continental: 3 },
  { year: 1975, island: 4, continental: 3 },
  { year: 2000, island: 4, continental: 3 },
];

const CHART_WIDTH = 1100;
const CHART_HEIGHT = 700;
const AXIS_BOTTOM = 60;
const AXIS_LEFT = 80;
const BAR_WIDTH = 40;
const BAR_GAP = 24;
const BUBBLE_RADIUS = 10;

function generateBubblesForBar(bar, barIdx) {
  const bubbles = [];
  for (let i = 0; i < bar.island; ++i) {
    bubbles.push({
      color: "#000",
      group: "Island",
      barIdx,
      idx: i,
      isIsland: true,
    });
  }
  for (let i = 0; i < bar.continental; ++i) {
    bubbles.push({
      color: "#fff",
      group: "Continental",
      barIdx,
      idx: bar.island + i,
      isIsland: false,
    });
  }
  return bubbles;
}

export default function BirdExtinctionBubbleBarChart() {
  // Flatten all bubbles for all bars
  const allBubbles = BAR_DATA.flatMap((bar, barIdx) =>
    generateBubblesForBar(bar, barIdx).map((b, i) => ({ ...b, globalIdx: `${barIdx}-${i}` }))
  );
  // Layout: assign x/y for each bubble in each bar
  const [nodes, setNodes] = useState([]);
  const [frozen, setFrozen] = useState(false);
  const [homes, setHomes] = useState([]);
  const [visibleTooltips, setVisibleTooltips] = useState([]);
  const visibleTooltipsRef = useRef([]);
  const tooltipTimers = useRef({});
  const [fadingTooltips, setFadingTooltips] = useState(new Set());
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [lastNear, setLastNear] = useState([]);
  const containerRef = useRef(null);
  useEffect(() => { visibleTooltipsRef.current = visibleTooltips; }, [visibleTooltips]);

  // Calculate bar positions
  const barMax = Math.max(...BAR_DATA.map(b => b.island + b.continental));
  const barHeight = CHART_HEIGHT - AXIS_BOTTOM - 40;
  // Assign home positions for force simulation
  useEffect(() => {
    // Calculate home positions for each bubble in each bar
    const bubbles = [];
    BAR_DATA.forEach((bar, barIdx) => {
      const total = bar.island + bar.continental;
      // Place bubbles randomly within the bar area
      for (let i = 0; i < total; ++i) {
        const isIsland = i < bar.island;
        const color = isIsland ? "#000" : "#fff";
        const group = isIsland ? "Island" : "Continental";
        // Bar area
        const barX = AXIS_LEFT + barIdx * (BAR_WIDTH + BAR_GAP);
        const barY = CHART_HEIGHT - AXIS_BOTTOM - barHeight;
        // Random position within bar
        const cx = barX + BAR_WIDTH / 2 + (Math.random() - 0.5) * (BAR_WIDTH - BUBBLE_RADIUS * 2);
        const cy = CHART_HEIGHT - AXIS_BOTTOM - (Math.random() * (barHeight * (total / barMax)));
        bubbles.push({
          x: cx,
          y: cy,
          color,
          group,
          barIdx,
          idx: i,
          globalIdx: `${barIdx}-${i}`,
          homeX: barX + BAR_WIDTH / 2,
          homeY: CHART_HEIGHT - AXIS_BOTTOM - (barHeight * (i / total)),
        });
      }
    });
    setNodes(bubbles);
    setFrozen(false);
    setHomes(bubbles.map(b => ({ x: b.x, y: b.y })));
  }, []);

  // D3 force simulation for dynamic layout
  useEffect(() => {
    if (!nodes.length || frozen) return;
    if (window._bubbleBarSim) window._bubbleBarSim.stop();
    const simulation = d3.forceSimulation(nodes)
      .force("x", d3.forceX(d => d.homeX).strength(0.2))
      .force("y", d3.forceY(d => d.homeY).strength(0.2))
      .force("collide", d3.forceCollide(BUBBLE_RADIUS + 1))
      .alpha(1)
      .alphaDecay(0.03)
      .on("tick", () => {
        setNodes([...simulation.nodes()]);
      });
    window._bubbleBarSim = simulation;
    setTimeout(() => {
      simulation.stop();
      setFrozen(true);
      setHomes(simulation.nodes().map(n => ({ x: n.x, y: n.y })));
    }, 4000);
    return () => simulation.stop();
  }, [nodes.length, frozen]);

  // Mouse proximity tooltips and repulsion (same as before, but with repulsion)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !frozen || !homes.length) return;
    let stationaryCheck = null;
    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const mouseDelta = Math.sqrt((mx - lastMousePos.current.x) ** 2 + (my - lastMousePos.current.y) ** 2);
      if (mouseDelta < 8) return;
      lastMousePos.current = { x: mx, y: my };
      setLastMoveTime(Date.now());
      // Find all bubbles within 40px of mouse
      const near = nodes
        .map((node, i) => ({
          i,
          dist: Math.sqrt((node.x - mx) ** 2 + (node.y - my) ** 2),
        }))
        .filter(({ dist }) => dist < 40)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 4)
        .map(({ i }) => i);
      setVisibleTooltips((prev) => {
        const newSet = new Set(prev);
        near.forEach(idx => newSet.add(idx));
        return Array.from(newSet);
      });
      setLastNear(near);
      // For indices not near, start a timer to hide after 3s
      const currentVisible = visibleTooltipsRef.current;
      currentVisible.forEach(idx => {
        if (!near.includes(idx)) {
          if (tooltipTimers.current[idx]) clearTimeout(tooltipTimers.current[idx]);
          tooltipTimers.current[idx] = setTimeout(() => {
            setFadingTooltips(prev => new Set([...prev, idx]));
            setTimeout(() => {
              setVisibleTooltips(current => current.filter(i => i !== idx));
              setFadingTooltips(prev => {
                const newSet = new Set(prev);
                newSet.delete(idx);
                return newSet;
              });
            }, 300);
            delete tooltipTimers.current[idx];
          }, 3000);
        } else if (tooltipTimers.current[idx]) {
          clearTimeout(tooltipTimers.current[idx]);
          delete tooltipTimers.current[idx];
        }
      });
      // Repel bubbles near mouse
      setNodes(prev => prev.map((node, i) => {
        let dx = node.x - mx;
        let dy = node.y - my;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let home = homes[i];
        if (dist < 40) {
          let repel = (1 - dist / 40) * 12;
          node.x += (dx / (dist || 1)) * repel;
          node.y += (dy / (dist || 1)) * repel;
        }
        // Spring force to home
        let hx = home.x - node.x;
        let hy = home.y - node.y;
        node.x += hx * 0.12;
        node.y += hy * 0.12;
        return { ...node };
      }));
    }
    container.addEventListener("mousemove", handleMouseMove);
    stationaryCheck = setInterval(() => {
      const now = Date.now();
      if (now - lastMoveTime > 100 && lastNear.length > 0) {
        setVisibleTooltips((prev) => {
          const newSet = new Set(prev);
          lastNear.forEach(idx => newSet.add(idx));
          return Array.from(newSet);
        });
        lastNear.forEach(idx => {
          if (tooltipTimers.current[idx]) {
            clearTimeout(tooltipTimers.current[idx]);
            delete tooltipTimers.current[idx];
          }
        });
      }
    }, 100);
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (stationaryCheck) clearInterval(stationaryCheck);
      Object.values(tooltipTimers.current).forEach(clearTimeout);
      tooltipTimers.current = {};
      setTimeout(() => setVisibleTooltips([]), 3000);
    };
  }, [frozen, homes, nodes, lastMoveTime, lastNear]);

  // Axis ticks
  const yTicks = [0, 5, 10, 15, 20, 25];

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      {/* Title and subtitle block */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 40,
        zIndex: 10,
        textAlign: 'left',
        width: 'auto',
        pointerEvents: 'none',
        paddingTop: 16,
      }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 700,
          margin: 0,
          color: '#222',
          letterSpacing: 0.5,
          lineHeight: 1.2,
        }}>
          Island vs. Continental Extinctions (Bubble Bar Chart)
        </h1>
        <div style={{
          fontSize: 18,
          fontWeight: 400,
          marginTop: 8,
          color: '#444',
          lineHeight: 1.4,
          maxWidth: 700,
          marginLeft: 0,
          marginRight: 0,
        }}>
          <div>
            Each bar represents extinctions per 25 years. <span style={{color:'#000',fontWeight:'bold'}}>Black bubbles</span> are island species, <span style={{color:'#222',fontWeight:'bold',background:'#fff',padding:'0 4px',border:'1px solid #222',borderRadius:2}}>white bubbles</span> are continental species.
          </div>
          <div style={{ marginTop: 12, fontSize: 16, color: '#444' }}>
            Move your mouse to explore.
          </div>
          <div style={{ height: 38 }}></div>
        </div>
      </div>
      <div style={{ position: "relative", width: CHART_WIDTH, height: CHART_HEIGHT + 60, margin: "0 auto", background: "none" }}>
        {/* Y Axis */}
        <svg width={CHART_WIDTH} height={CHART_HEIGHT + 60} style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}>
          {/* Y axis line */}
          <line x1={AXIS_LEFT} y1={CHART_HEIGHT - AXIS_BOTTOM} x2={AXIS_LEFT} y2={40} stroke="#222" strokeWidth={2} />
          {/* Y axis ticks and labels */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={AXIS_LEFT - 6} y1={CHART_HEIGHT - AXIS_BOTTOM - tick * (BUBBLE_RADIUS * 2.1)} x2={AXIS_LEFT} y2={CHART_HEIGHT - AXIS_BOTTOM - tick * (BUBBLE_RADIUS * 2.1)} stroke="#222" strokeWidth={2} />
              <text x={AXIS_LEFT - 10} y={CHART_HEIGHT - AXIS_BOTTOM - tick * (BUBBLE_RADIUS * 2.1) + 5} textAnchor="end" fontSize={16} fill="#222">{tick}</text>
              {/* Grid line */}
              <line x1={AXIS_LEFT} y1={CHART_HEIGHT - AXIS_BOTTOM - tick * (BUBBLE_RADIUS * 2.1)} x2={CHART_WIDTH - 20} y2={CHART_HEIGHT - AXIS_BOTTOM - tick * (BUBBLE_RADIUS * 2.1)} stroke="#aaa" strokeDasharray="4 3" strokeWidth={1} />
            </g>
          ))}
          {/* X axis line */}
          <line x1={AXIS_LEFT} y1={CHART_HEIGHT - AXIS_BOTTOM} x2={CHART_WIDTH - 20} y2={CHART_HEIGHT - AXIS_BOTTOM} stroke="#222" strokeWidth={2} />
          {/* X axis ticks and labels */}
          {BAR_DATA.map((bar, i) => (
            <g key={bar.year}>
              <line x1={AXIS_LEFT + i * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2} y1={CHART_HEIGHT - AXIS_BOTTOM} x2={AXIS_LEFT + i * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2} y2={CHART_HEIGHT - AXIS_BOTTOM + 6} stroke="#222" strokeWidth={2} />
              <text x={AXIS_LEFT + i * (BAR_WIDTH + BAR_GAP) + BAR_WIDTH / 2} y={CHART_HEIGHT - AXIS_BOTTOM + 22} textAnchor="middle" fontSize={15} fill="#222">{bar.year}</text>
            </g>
          ))}
          {/* Axis labels */}
          <text x={AXIS_LEFT - 50} y={60} textAnchor="middle" fontSize={18} fill="#222" transform={`rotate(-90,${AXIS_LEFT - 50},60)`} fontWeight={600}>
            Extinctions per 25 years
          </text>
          <text x={AXIS_LEFT + (BAR_DATA.length * (BAR_WIDTH + BAR_GAP)) / 2} y={CHART_HEIGHT - AXIS_BOTTOM + 50} textAnchor="middle" fontSize={18} fill="#222" fontWeight={600}>
            Year
          </text>
        </svg>
        {/* Legend */}
        <div style={{ position: "absolute", left: AXIS_LEFT + 10, top: 0, zIndex: 10, display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 18, height: 18, background: "#fff", border: "2px solid #222", borderRadius: 4 }} />
            <span style={{ fontSize: 15, color: "#222" }}>Continental</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 18, height: 18, background: "#000", border: "2px solid #222", borderRadius: 4 }} />
            <span style={{ fontSize: 15, color: "#222" }}>Island</span>
          </div>
        </div>
        {/* Bubble chart container */}
        <div
          ref={containerRef}
          style={{ width: CHART_WIDTH, height: CHART_HEIGHT, position: "relative", margin: "0 auto", background: "none", borderRadius: 0, boxShadow: "none" }}
        >
          {nodes.map((b, idx) => {
            const tooltipIdx = visibleTooltips.filter(i => i < idx).length;
            return (
              <React.Fragment key={b.globalIdx}>
                <div
                  className="bubble"
                  style={{
                    background: b.color,
                    left: b.x - BUBBLE_RADIUS,
                    top: b.y - BUBBLE_RADIUS,
                    width: BUBBLE_RADIUS * 2,
                    height: BUBBLE_RADIUS * 2,
                    position: "absolute",
                    transition: "background 0.3s",
                    zIndex: 2,
                    border: b.color === "#fff" ? "2px solid #222" : "none",
                    boxShadow: "none",
                  }}
                  title={b.group}
                />
                {visibleTooltips.includes(idx) && (
                  <div
                    style={{
                      position: "absolute",
                      left: b.x,
                      top: b.y - BUBBLE_RADIUS - 18 - tooltipIdx * 14,
                      transform: "translate(-50%, -100%)",
                      color: "#000",
                      fontSize: 14,
                      fontWeight: 500,
                      pointerEvents: "none",
                      zIndex: 20,
                      whiteSpace: "nowrap",
                      background: "white",
                      padding: 0,
                      margin: 0,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      border: "none",
                      borderRadius: "0px",
                      padding: "6px 12px",
                      opacity: 1,
                      background: "rgba(255,255,255,0.95)",
                      transition: "all 0.15s ease-out",
                      animation: fadingTooltips.has(idx)
                        ? "tooltipFadeOut 0.3s ease-out forwards"
                        : "tooltipFadeIn 0.15s ease-out",
                    }}
                  >
                    {b.group}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <div style={{ marginTop: 30 }} />
    </div>
  );
} 