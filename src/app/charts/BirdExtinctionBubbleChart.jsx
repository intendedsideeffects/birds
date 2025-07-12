"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "./BubbleChart.css";

const TOTAL_BIRDS = 1298;
const VIEWS = [
  {
    label: "90% of extinct species went extinct due to human activities.",
    groups: [
      { count: Math.round(TOTAL_BIRDS * 0.9), color: "rgba(0,0,0,0.8)", label: "Human-caused" },
      { count: TOTAL_BIRDS - Math.round(TOTAL_BIRDS * 0.9), color: "rgba(128,0,128,0.3)", label: "Other" },
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

const BUBBLE_RADIUS = 7;

export default function BirdExtinctionBubbleChart() {
  const [view, setView] = useState(0);
  const [nodes, setNodes] = useState([]);
  const [frozen, setFrozen] = useState(false);
  const [homes, setHomes] = useState([]);
  const simulationRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Responsive container size
  useEffect(() => {
    function updateSize() {
      setDimensions({
        width: Math.min(window.innerWidth, 1100),
        height: Math.min(window.innerHeight - 120, 900),
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

  // Mouse repulsion: repel bubbles near mouse, apply spring force to home
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !frozen || !homes.length) return;
    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
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
    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [frozen, homes]);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>{VIEWS[view].label}</h2>
      <div
        className="bubble-chart-container"
        ref={containerRef}
        style={{ width: WIDTH, height: HEIGHT, position: "relative", margin: "0 auto", background: "none", borderRadius: 0, boxShadow: "none" }}
      >
        {nodes.map((b) => (
          <div
            key={b.key}
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
        ))}
      </div>
      <div style={{ marginTop: 30 }}>
        <button onClick={() => setView((view + 1) % VIEWS.length)} disabled>
          Next View
        </button>
      </div>
      <div style={{ marginTop: 20, fontSize: 14, color: "#666" }}>
        {VIEWS[view].groups.map((g) => (
          <span key={g.label} style={{ margin: "0 12px" }}>
            <span
              style={{
                display: "inline-block",
                width: 16,
                height: 16,
                background: g.color,
                borderRadius: "50%",
                marginRight: 6,
                verticalAlign: "middle",
              }}
            />
            {g.label}
          </span>
        ))}
      </div>
    </div>
  );
}
// BubbleChart.css (no change needed) 