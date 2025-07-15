"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { geoSpilhausProjection } from "d3-geo-projection";

export default function BirdExtinctionVisualization() {
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

  // Helper to generate nodes for a blob with separated segments
  function generateBlobNodes(centerX, centerY, totalNodes, continentRatio, islandRatio, baseRadius, blobType) {
    const continentCount = Math.round(totalNodes * continentRatio);
    const islandCount = totalNodes - continentCount;
    const nodes = [];
    // Calculate segment centers - side by side with proper proportional spacing
    const totalRatio = continentRatio + islandRatio;
    const continentWidth = (continentRatio / totalRatio) * baseRadius * 1.6;
    const islandWidth = (islandRatio / totalRatio) * baseRadius * 1.6;
    // Position segments side by side, centered around centerX
    const continentCenterX = centerX - (islandWidth / 2);
    const islandCenterX = centerX + (continentWidth / 2);
    // Generate continent nodes (left segment)
    for (let i = 0; i < continentCount; i++) {
      const angle = (2 * Math.PI * i) / Math.max(continentCount, 1);
      const radius = (continentWidth / 2) * (0.4 + 0.5 * Math.random());
      nodes.push({
        x: continentCenterX + Math.cos(angle) * radius + (Math.random() - 0.5) * 8,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 8,
        group: "Continent",
        color: "#222",
        key: `c-${i}-${blobType}`,
        blob: blobType,
        radius: 3,
      });
    }
    // Generate island nodes (right segment)
    for (let i = 0; i < islandCount; i++) {
      const angle = (2 * Math.PI * i) / Math.max(islandCount, 1);
      const radius = (islandWidth / 2) * (0.4 + 0.5 * Math.random());
      nodes.push({
        x: islandCenterX + Math.cos(angle) * radius + (Math.random() - 0.5) * 8,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 8,
        group: "Island",
        color: "#9f7aea",
        key: `i-${i}-${blobType}`,
        blob: blobType,
        radius: 3,
      });
    }
    return nodes;
  }

  // Generate nodes after we know the real size
  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const centerY = dimensions.height / 2;
    // Use linear scaling for dramatic difference
    const baseRadius = 40 * 1.3;
    const scalingFactor = 5 * 1.3;
    const extinctSpeciesRadius = baseRadius;
    const totalSpeciesRadius = baseRadius * scalingFactor;
    // Centering calculation
    const totalBlobWidth = totalSpeciesRadius * 2.2;
    const extinctBlobWidth = extinctSpeciesRadius * 2.2;
    const spacing = 400;
    const totalWidth = totalBlobWidth + spacing + extinctBlobWidth;
    const startX = (dimensions.width - totalWidth) / 2;
    const leftCenterX = startX + totalSpeciesRadius;
    const rightCenterX = startX + totalBlobWidth + spacing + extinctSpeciesRadius;
    // Generate nodes
    const totalNodes = generateBlobNodes(
      leftCenterX, centerY, 300, 0.8, 0.2, totalSpeciesRadius, 'total'
    );
    const extinctNodes = generateBlobNodes(
      rightCenterX, centerY, 60, 0.125, 0.875, extinctSpeciesRadius, 'extinct'
    );
    setNodes([...totalNodes, ...extinctNodes]);
    setFrozen(false);
    setHomes([]);
  }, [dimensions]);

  // D3 force simulation for initial layout
  useEffect(() => {
    if (!nodes.length || frozen || !dimensions.width || !dimensions.height) return;
    if (simulationRef.current) simulationRef.current.stop();
    const simulation = d3.forceSimulation(nodes)
      .force("collision", d3.forceCollide(d => d.radius + 2))
      .force("charge", d3.forceManyBody().strength(-2))
      .alpha(0.3)
      .alphaDecay(0.02)
      .on("tick", () => setNodes([...simulation.nodes()]));
    simulationRef.current = simulation;
    const timeout = setTimeout(() => {
      simulation.stop();
      setFrozen(true);
      setHomes(simulation.nodes().map(n => ({ x: n.x, y: n.y })));
    }, 2000);
    return () => {
      simulation.stop();
      clearTimeout(timeout);
    };
  }, [nodes.length, frozen, dimensions.width, dimensions.height]);

  // Mouse interaction
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !frozen || !homes.length) return;
    function handleMouseMove(e) {
      const rect = container.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setNodes(prev => prev.map((node, i) => {
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const home = homes[i];
        if (dist < 100 && dist > 0) {
          const repel = (1 - dist / 100) * 5;
          const normalizedDx = dx / dist;
          const normalizedDy = dy / dist;
          return {
            ...node,
            x: node.x + normalizedDx * repel,
            y: node.y + normalizedDy * repel,
          };
        }
        return {
          ...node,
          x: node.x + (home.x - node.x) * 0.1,
          y: node.y + (home.y - node.y) * 0.1,
        };
      }));
    }
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [frozen, homes]);

  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div>Loading...</div>;
  }

  // Create hulls for visualization
  const totalNodes = nodes.filter(n => n.blob === 'total');
  const extinctNodes = nodes.filter(n => n.blob === 'extinct');
  const totalContinentNodes = totalNodes.filter(n => n.group === 'Continent');
  const totalIslandNodes = totalNodes.filter(n => n.group === 'Island');
  const extinctContinentNodes = extinctNodes.filter(n => n.group === 'Continent');
  const extinctIslandNodes = extinctNodes.filter(n => n.group === 'Island');
  const line = d3.line().curve(d3.curveCatmullRomClosed);

  return (
    <div ref={containerRef} style={{ width: "100vw", height: "100vh", background: "#fff" }}>
      {/* Title */}
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
          lineHeight: 1.2,
        }}>
          Island birds die out more often.
        </h1>
        <div style={{
          fontSize: 18,
          fontWeight: 400,
          marginTop: 8,
          color: '#222',
          lineHeight: 1.4,
          maxWidth: 700,
        }}>
          <span style={{ fontWeight: 'bold' }}>
            80% of bird species live on continents
          </span>
          {`, but `}
          <span style={{ fontWeight: 'bold', color: '#9f7aea', opacity: 0.4 }}>
            island species make up 87.5% of all bird species extinctions
          </span>
          {`. `}
          <br />
          Island birds went extinct more often because they evolved without predators, lived in small populations, and couldn't cope with rapid human-driven changes like the introduction of invasive species, habitat loss, and disease.
        </div>
      </div>
      <svg width={dimensions.width} height={dimensions.height} style={{ display: "block" }}>
        {/* Arrowhead marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#222" />
          </marker>
        </defs>

        {/* Container blobs (light grey background) */}
        {totalNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(totalNodes.map(n => [n.x, n.y])))} 
            fill="#e2e8f0" 
            opacity={0.3} 
            stroke="#cbd5e0"
            strokeWidth={3}
          />
        )}
        {extinctNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(extinctNodes.map(n => [n.x, n.y])))} 
            fill="#e2e8f0" 
            opacity={0.3} 
            stroke="#cbd5e0"
            strokeWidth={3}
          />
        )}
        {/* Total species segments */}
        {totalContinentNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(totalContinentNodes.map(n => [n.x, n.y])))} 
            fill="#222" 
            opacity={0.8} 
            stroke="#222"
            strokeWidth={2}
          />
        )}
        {totalIslandNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(totalIslandNodes.map(n => [n.x, n.y])))} 
            fill="#9f7aea" 
            opacity={0.4} 
            stroke="#9f7aea"
            strokeWidth={2}
          />
        )}
        {/* Extinct species segments */}
        {extinctContinentNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(extinctContinentNodes.map(n => [n.x, n.y])))} 
            fill="#222" 
            opacity={0.8} 
            stroke="#222"
            strokeWidth={2}
          />
        )}
        {extinctIslandNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(extinctIslandNodes.map(n => [n.x, n.y])))} 
            fill="#9f7aea" 
            opacity={0.4} 
            stroke="#9f7aea"
            strokeWidth={2}
          />
        )}
        {/* Annotations with curved arrows */}
        {/* Left (large blob): all ~10,000 bird species */}
        <path
          d={`M ${dimensions.width * 0.16} ${dimensions.height * 0.78} Q ${dimensions.width * 0.22} ${dimensions.height * 0.72}, ${dimensions.width * 0.26} ${dimensions.height * 0.70}`}
          fill="none"
          stroke="#222"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          opacity="0.7"
        />
        <text
          x={dimensions.width * 0.02}
          y={dimensions.height * 0.88}
          fontSize="18"
          fill="#222"
          fontWeight="bold"
          textAnchor="start"
        >
          {`Of all ~10,000 bird species,`}
          <tspan x={dimensions.width * 0.02} dy="1.2em">80% are continental,</tspan>
          <tspan x={dimensions.width * 0.02} dy="1.2em">20% live on islands.</tspan>
        </text>
        {/* Right (small blob): all ~1,300 extinct species */}
        <path
          d={`M ${dimensions.width * 0.87} ${dimensions.height * 0.32} Q ${dimensions.width * 0.80} ${dimensions.height * 0.38}, ${dimensions.width * 0.72} ${dimensions.height * 0.44}`}
          fill="none"
          stroke="#222"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          opacity="0.7"
        />
        <text
          x={dimensions.width * 0.87}
          y={dimensions.height * 0.20}
          fontSize="18"
          fill="#222"
          fontWeight="bold"
          textAnchor="start"
        >
          {`Of all ~1,300 extinct species,`}
          <tspan x={dimensions.width * 0.87} dy="1.2em">87.5% lived on islands,</tspan>
          <tspan x={dimensions.width * 0.87} dy="1.2em">just 12.5% were continental.</tspan>
        </text>
      </svg>
    </div>
  );
}