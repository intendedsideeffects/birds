"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { polygonHull } from "d3-polygon";

const BUBBLE_RADIUS = 35;
const CONTINENT_COLOR = "#222";
const ISLAND_COLOR = "#b9aee0";

function generateSwarmBubbles(width, height) {
  let bubbles = [];
  for (let i = 0; i < 80; i++) {
    bubbles.push({ color: CONTINENT_COLOR, group: "Continent", key: `c-${i}` });
  }
  for (let i = 0; i < 20; i++) {
    bubbles.push({ color: ISLAND_COLOR, group: "Island", key: `i-${i}` });
  }
  return bubbles.map((b, i, arr) => {
    const angle = (2 * Math.PI * i) / arr.length;
    const radius = (Math.min(width, height) / 3.5) * (0.2 + 0.05 * Math.random());
    return {
      ...b,
      x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
      y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 2,
      vx: 0,
      vy: 0,
    };
  });
}

export default function VoronoiProportionComparison() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState([]);
  const [frozen, setFrozen] = useState(false);
  const [homes, setHomes] = useState([]);
  const simulationRef = useRef(null);
  const containerRef = useRef(null);

  // SSR-safe: only set dimensions on the client
  useEffect(() => {
    function handleResize() {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parameters for the two blobs
  const allSpecies = {
    count: 10000,
    continent: 0.9,
    island: 0.1,
    colorContinent: CONTINENT_COLOR,
    colorIsland: ISLAND_COLOR,
    label: "All species"
  };
  const extinctSpecies = {
    count: 1298,
    continent: 0.125,
    island: 0.875,
    colorContinent: CONTINENT_COLOR,
    colorIsland: ISLAND_COLOR,
    label: "Extinct species"
  };

  // Helper to generate nodes for a blob
  function generateBlobNodes(centerX, centerY, total, continentRatio, islandRatio, baseRadius, blob) {
    const continentCount = Math.round(total * continentRatio);
    const islandCount = total - continentCount;
    const nodes = [];
    for (let i = 0; i < continentCount; i++) {
      const angle = (2 * Math.PI * i) / total;
      const radius = baseRadius * (0.7 + 0.3 * Math.random());
      nodes.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * baseRadius * 0.2,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * baseRadius * 0.2,
        group: "Continent",
        color: CONTINENT_COLOR,
        key: `c-${i}-${centerX}`,
        blob,
      });
    }
    for (let i = 0; i < islandCount; i++) {
      const angle = (2 * Math.PI * (continentCount + i)) / total;
      const radius = baseRadius * (0.7 + 0.3 * Math.random());
      nodes.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * baseRadius * 0.2,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * baseRadius * 0.2,
        group: "Island",
        color: ISLAND_COLOR,
        key: `i-${i}-${centerX}`,
        blob,
      });
    }
    return nodes;
  }

  // Generate bubbles after we know the real size
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    // Set right blob radius as base, left blob radius proportional to species count
    const rightRadius = 14;
    const leftRadius = rightRadius * Math.sqrt(10000 / 1298);
    const leftCenterX = 100;
    const rightCenterX = 500;
    const centerY = 200;
    // Increase node counts for accurate hulls
    const leftNodes = generateBlobNodes(leftCenterX, centerY, 100, 0.9, 0.1, leftRadius, 'left');
    const rightNodes = generateBlobNodes(rightCenterX, centerY, 40, 0.125, 0.875, rightRadius, 'right');
    setNodes([...leftNodes, ...rightNodes]);
    setFrozen(false);
    setHomes([]);
  }, [dimensions]);

  // D3 force simulation for initial layout only
  useEffect(() => {
    if (!nodes.length || frozen || !dimensions.width || !dimensions.height) return;
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    const simulation = d3.forceSimulation(nodes)
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(1.5))
      .force("collision", d3.forceCollide(BUBBLE_RADIUS - 20))
      .alpha(0.9)
      .alphaDecay(0.02)
      .on("tick", () => {
        setNodes([...simulation.nodes()]);
      });
    simulationRef.current = simulation;

    const timeout = setTimeout(() => {
      simulation.stop();
      setFrozen(true);
      setHomes(simulation.nodes().map(n => ({ x: n.x, y: n.y })));
    }, 3000);
    return () => {
      simulation.stop();
      clearTimeout(timeout);
    };
  }, [nodes.length, frozen, dimensions.width, dimensions.height]);

  // Mouse repulsion and spring-back
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !frozen || !homes.length) return;

    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      setNodes(prev => prev.map((node, i) => {
        let dx = node.x - mx;
        let dy = node.y - my;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let home = homes[i];

        // Repel if near mouse
        if (dist < 80) {
          let repel = (1 - dist / 80) * 6; // much less repulsion
          dx /= dist || 1;
          dy /= dist || 1;
          return {
            ...node,
            x: node.x + dx * repel,
            y: node.y + dy * repel,
          };
        }
        // Stronger spring back
        return {
          ...node,
          x: node.x + (home.x - node.x) * 0.22,
          y: node.y + (home.y - node.y) * 0.22,
        };
      }));
    }

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [frozen, homes]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return null; // or a loading spinner
  }

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh" }}>
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
          Continental vs. Island Bird Species: Extinction Disproportion
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
          While <b>80% of all bird species are continental</b>, <b>87.5% of extinct species are from islands</b>.
        </div>
      </div>
      <svg width={dimensions.width} height={dimensions.height} style={{ display: "block" }}>
        {(() => {
          // Separate nodes by group and blob
          // Left blob (all species)
          const leftContinent = nodes.filter(n => n.blob === 'left' && n.group === 'Continent');
          const leftIsland = nodes.filter(n => n.blob === 'left' && n.group === 'Island');
          const leftHull = d3.polygonHull([...leftContinent, ...leftIsland].map(n => [n.x, n.y]));
          // Color by group ratio
          const leftIslandHull = d3.polygonHull(leftIsland.map(n => [n.x, n.y]));
          const leftContinentHull = d3.polygonHull(leftContinent.map(n => [n.x, n.y]));

          // Right blob (extinct species)
          const rightContinent = nodes.filter(n => n.blob === 'right' && n.group === 'Continent');
          const rightIsland = nodes.filter(n => n.blob === 'right' && n.group === 'Island');
          const rightHull = d3.polygonHull([...rightContinent, ...rightIsland].map(n => [n.x, n.y]));
          const rightIslandHull = d3.polygonHull(rightIsland.map(n => [n.x, n.y]));
          const rightContinentHull = d3.polygonHull(rightContinent.map(n => [n.x, n.y]));

          const line = d3.line().curve(d3.curveCatmullRomClosed);
          return <>
            {/* Left blob: all species */}
            {leftHull && (
              <path d={line(leftHull)} fill="#eaeaea" opacity={1} />
            )}
            {leftContinentHull && (
              <path d={line(leftContinentHull)} fill={CONTINENT_COLOR} opacity={0.9} />
            )}
            {leftIslandHull && (
              <path d={line(leftIslandHull)} fill={ISLAND_COLOR} opacity={0.9} />
            )}
            {/* Right blob: extinct species */}
            {rightHull && (
              <path d={line(rightHull)} fill="#ffe066" opacity={1} />
            )}
            {rightContinentHull && (
              <path d={line(rightContinentHull)} fill="#ffe066" opacity={0.9} />
            )}
            {rightIslandHull && (
              <path d={line(rightIslandHull)} fill="#ffe066" opacity={0.9} />
            )}
          </>;
        })()}
      </svg>
    </div>
  );
} 