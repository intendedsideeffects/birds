"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BubbleChart.css";

// Add CSS for smooth tooltip transitions
const tooltipStyles = `
  @keyframes tooltipFadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -100%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -100%) scale(1);
    }
  }
  
  @keyframes tooltipFadeOut {
    from {
      opacity: 1;
      transform: translate(-50%, -100%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -100%) scale(0.9);
    }
  }
`;

const TOTAL_BIRDS = 1298;
const VIEWS = [
  {
    label: "90% of extinct species went extinct due to human activities.",
    groups: [
      { count: Math.round(TOTAL_BIRDS * 0.9), color: "rgba(0,0,0,0.8)", label: "Human-caused" },
      { count: TOTAL_BIRDS - Math.round(TOTAL_BIRDS * 0.9), color: "#e5dfcc", label: "Other" },
    ],
  },
  // {
  //   label: "87.5% of extinct species lived on islands.",
  //   groups: [
  //     { count: Math.round(TOTAL_BIRDS * 0.875), color: "#64b5f6", label: "Islands" },
  //     { count: TOTAL_BIRDS - Math.round(TOTAL_BIRDS * 0.875), color: "#bdbdbd", label: "Continents" },
  //   ],
  // },
  // {
  //   label: "96.3% were endemic.",
  //   groups: [
  //     { count: Math.round(TOTAL_BIRDS * 0.963), color: "#81c784", label: "Endemic" },
  //     { count: TOTAL_BIRDS - Math.round(TOTAL_BIRDS * 0.963), color: "#bdbdbd", label: "Not endemic" },
  //   ],
  // },
  // {
  //   label: "79.63% could fly, 15.4% could not fly, 4.63% could partially fly.",
  //   groups: [
  //     { count: Math.round(TOTAL_BIRDS * 0.7963), color: "#ffd54f", label: "Could fly" },
  //     { count: Math.round(TOTAL_BIRDS * 0.154), color: "#ba68c8", label: "Could not fly" },
  //     { count: TOTAL_BIRDS - Math.round(TOTAL_BIRDS * 0.7963) - Math.round(TOTAL_BIRDS * 0.154), color: "#4fc3f7", label: "Partially fly" },
  //   ],
  // },
];

function generateBubbles(groups) {
  let bubbles = [];
  let idx = 0;
  groups.forEach((g, i) => {
    for (let j = 0; j < g.count; j++) {
      bubbles.push({
        color: g.color,
        group: g.label,
        key: `${i}-${j}`,
        idx: idx++,
      });
    }
  });
  return bubbles;
}

// Reduce bubble radius by 20%
const BUBBLE_RADIUS = 7 * 0.8;

export default function BirdExtinctionBubbleChart() {
  const [view, setView] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [frozen, setFrozen] = useState(false);
  const [homes, setHomes] = useState([]);
  const simulationRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredIndices, setHoveredIndices] = useState([]);
  const tooltipTimers = useRef({});
  const [visibleTooltips, setVisibleTooltips] = useState([]);
  const visibleTooltipsRef = useRef([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const [fadingTooltips, setFadingTooltips] = useState(new Set());
  const [lastMoveTime, setLastMoveTime] = useState(Date.now());
  const [lastNear, setLastNear] = useState([]);
  useEffect(() => { visibleTooltipsRef.current = visibleTooltips; }, [visibleTooltips]);

  // Responsive container size
  useEffect(() => {
    function updateSize() {
      setDimensions({
        width: Math.min(window.innerWidth, 1100) * 0.8,
        height: Math.min(window.innerHeight - 120, 900) * 0.8,
      });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  const WIDTH = dimensions.width;
  const HEIGHT = dimensions.height;

  // Generate bubbles for the current view
  useEffect(() => {
    if (!WIDTH || !HEIGHT) return;
    // Start bubbles in a noisy circle
    const bubbles = generateBubbles(VIEWS[view].groups).map((b, i, arr) => {
      const angle = (2 * Math.PI * i) / arr.length;
      const radius = (Math.min(WIDTH, HEIGHT) / 2.5) * (0.7 + 0.3 * Math.random());
      return {
        ...b,
        x: WIDTH / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 10,
        y: HEIGHT / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 10,
      };
    });
    setNodes(bubbles);
    setFrozen(false);
    setHomes([]);
  }, [view, WIDTH, HEIGHT]);

  // D3 force simulation for initial layout only
  useEffect(() => {
    if (!nodes.length || frozen || !WIDTH || !HEIGHT) return;
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    const simulation = d3.forceSimulation(nodes)
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2).strength(1.2))
      .force("collision", d3.forceCollide(BUBBLE_RADIUS + 0.5))
      .alpha(0.9)
      .alphaDecay(0.02)
      .on("tick", () => {
        setNodes([...simulation.nodes()]);
      });
    simulationRef.current = simulation;
    // Stop simulation after 4 seconds and store home positions
    const timeout = setTimeout(() => {
      simulation.stop();
      setFrozen(true);
      setHomes(simulation.nodes().map(n => ({ x: n.x, y: n.y })));
    }, 4000);
    return () => {
      simulation.stop();
      clearTimeout(timeout);
    };
  }, [nodes.length, frozen, WIDTH, HEIGHT]);

  // Mouse proximity tooltips with memory effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !frozen || !homes.length) return;
    let stationaryCheck = null;
    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      
      // Dead zone: only update if mouse moved more than 8px
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
        .sort((a, b) => a.dist - b.dist) // Sort by distance
        .slice(0, 4) // Only keep the 4 closest
        .map(({ i }) => i);
      setHoveredIndices(near);
      setLastNear(near);
      // Set tooltips visible for all near indices
      setVisibleTooltips((prev) => {
        const newSet = new Set(prev);
        near.forEach(idx => newSet.add(idx));
        return Array.from(newSet);
      });
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
            }, 300); // Fade out duration
            delete tooltipTimers.current[idx];
          }, 3000);
        } else if (tooltipTimers.current[idx]) {
          clearTimeout(tooltipTimers.current[idx]);
          delete tooltipTimers.current[idx];
        }
      });
      // Repulsion and spring force
      setNodes((prev) => prev.map((node, i) => {
        let dx = node.x - mx;
        let dy = node.y - my;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let home = homes[i];
        // Repel if near mouse
        if (dist < 40) {
          let repel = (1 - dist / 40) * 10;
          node.x += (dx / (dist || 1)) * repel;
          node.y += (dy / (dist || 1)) * repel;
        }
        // Spring force to home
        let hx = home.x - node.x;
        let hy = home.y - node.y;
        node.x += hx * 0.1;
        node.y += hy * 0.1;
        return { ...node };
      }));
    }
    container.addEventListener("mousemove", handleMouseMove);
    // Stationary mouse check: keep tooltips visible if mouse is still and near bubbles
    stationaryCheck = setInterval(() => {
      const now = Date.now();
      // If mouse hasn't moved for 100ms and is still near bubbles, keep tooltips visible
      if (now - lastMoveTime > 100 && lastNear.length > 0) {
        setVisibleTooltips((prev) => {
          const newSet = new Set(prev);
          lastNear.forEach(idx => newSet.add(idx));
          return Array.from(newSet);
        });
        // Cancel fade-out timers for these tooltips
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
      // On unmount, clear all timers and hide all tooltips after 3s
      Object.values(tooltipTimers.current).forEach(clearTimeout);
      tooltipTimers.current = {};
      setTimeout(() => setVisibleTooltips([]), 3000);
    };
  }, [frozen, homes, nodes, lastMoveTime, lastNear]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <style>{tooltipStyles}</style>
      {/* Title and subtitle block */}
      <div style={{
        maxWidth: '700px',
        margin: '0 auto 2rem auto',
        padding: '0 1rem',
        textAlign: 'left',
        color: '#111',
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          letterSpacing: '-.01em',
          textAlign: 'left',
        }}>
          Each dot represents a bird species lost to extinction.
        </h2>
        <p style={{
          fontSize: '1.15rem',
          color: '#222',
          marginBottom: '0',
          lineHeight: 1.6,
          textAlign: 'left',
        }}>
          Since 5000 BCE, 1298 bird species have gone extinct. 90% were caused by <span style={{color:'black',fontWeight:'bold'}}>human activity</span>. The rest were due to <span style={{color:'#e5dfcc',fontWeight:'bold'}}>natural causes</span>.
        </p>
      </div>
      {/* Bubble chart container */}
      <div
        className="bubble-chart-container"
        ref={containerRef}
        style={{ width: WIDTH, height: HEIGHT, position: "relative", margin: "0 auto", background: "none", borderRadius: 0, boxShadow: "none" }}
      >
        {nodes.map((b, idx) => {
          const tooltipIdx = visibleTooltips.filter(i => i < idx).length;
          return (
            <React.Fragment key={b.key}>
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
                  border: "none",
                  boxShadow: "none",
                }}
                title={b.group}
              />
              {/* Tooltip rendering - commented out for now */}
              {/* {visibleTooltips.includes(idx) && (
                <div
                  style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y - BUBBLE_RADIUS - 18 - tooltipIdx * 14, // offset each tooltip by 14px
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
                  {b.group === 'Other' ? 'Natural' : b.group}
                </div>
              )} */}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
// BubbleChart.css (no change needed) 