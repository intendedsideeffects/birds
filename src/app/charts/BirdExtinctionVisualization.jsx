"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const CONTINENT_COLOR = "#4a5568";
const ISLAND_COLOR = "#9f7aea";
const EXTINCT_COLOR = "#ffd700";

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
    const continentWidth = (continentRatio / totalRatio) * baseRadius * 1.6; // Width proportional to ratio
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
        color: CONTINENT_COLOR,
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
        color: ISLAND_COLOR,
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
    
    // NEW: Use linear scaling to make the difference more dramatic
    const baseRadius = 40; // Base size for extinct species
    const scalingFactor = 5; // How much bigger to make the total species blob
    
    const extinctSpeciesRadius = baseRadius;
    const totalSpeciesRadius = baseRadius * scalingFactor; // 5x bigger radius = 25x bigger area
    
    // Better centering calculation with more dramatic spacing
    const totalBlobWidth = totalSpeciesRadius * 2.2;
    const extinctBlobWidth = extinctSpeciesRadius * 2.2;
    const spacing = 400; // More space to emphasize the difference
    const totalWidth = totalBlobWidth + spacing + extinctBlobWidth;
    
    // Center the entire visualization
    const startX = (dimensions.width - totalWidth) / 2;
    const leftCenterX = startX + totalSpeciesRadius;
    const rightCenterX = startX + totalBlobWidth + spacing + extinctSpeciesRadius;
    
    // Generate proportional number of nodes (more nodes for bigger blob)
    const totalNodes = generateBlobNodes(
      leftCenterX, 
      centerY, 
      300, // More nodes for the bigger blob
      0.8, // 80% continent
      0.2, // 20% island
      totalSpeciesRadius, 
      'total'
    );
    
    const extinctNodes = generateBlobNodes(
      rightCenterX, 
      centerY, 
      60, // Fewer nodes for smaller blob
      0.125, // 12.5% continent (MUCH smaller)
      0.875, // 87.5% island (MUCH larger)
      extinctSpeciesRadius, 
      'extinct'
    );
    
    setNodes([...totalNodes, ...extinctNodes]);
    setFrozen(false);
    setHomes([]);
  }, [dimensions]);

  // D3 force simulation for initial layout
  useEffect(() => {
    if (!nodes.length || frozen || !dimensions.width || !dimensions.height) return;
    
    if (simulationRef.current) {
      simulationRef.current.stop();
    }
    
    const simulation = d3.forceSimulation(nodes)
      .force("collision", d3.forceCollide(d => d.radius + 2))
      .force("charge", d3.forceManyBody().strength(-2))
      .alpha(0.3)
      .alphaDecay(0.02)
      .on("tick", () => {
        setNodes([...simulation.nodes()]);
      });
    
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

        // Repel if near mouse
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
        
        // Spring back to home position
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

  // Calculate label positions based on actual blob centers
  const totalBlobCenter = totalNodes.length > 0 ? {
    x: totalNodes.reduce((sum, n) => sum + n.x, 0) / totalNodes.length,
    y: totalNodes.reduce((sum, n) => sum + n.y, 0) / totalNodes.length
  } : { x: 0, y: 0 };

  const extinctBlobCenter = extinctNodes.length > 0 ? {
    x: extinctNodes.reduce((sum, n) => sum + n.x, 0) / extinctNodes.length,
    y: extinctNodes.reduce((sum, n) => sum + n.y, 0) / extinctNodes.length
  } : { x: 0, y: 0 };

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
          Bird Species Extinction Disproportion
        </h1>
        <div style={{
          fontSize: 18,
          fontWeight: 400,
          marginTop: 8,
          color: '#444',
          lineHeight: 1.4,
          maxWidth: 700,
        }}>
          While <strong>80% of all bird species</strong> live on continents, <strong>87.5% of extinct species</strong> were from islands.
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: 120,
        left: 40,
        zIndex: 10,
        display: 'flex',
        gap: 30,
        fontSize: 16,
        fontWeight: 500,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 20, 
            height: 20, 
            backgroundColor: CONTINENT_COLOR,
            borderRadius: '50%'
          }}></div>
          <span>Continental Species</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 20, 
            height: 20, 
            backgroundColor: ISLAND_COLOR,
            borderRadius: '50%'
          }}></div>
          <span>Island Species</span>
        </div>
      </div>

      {/* Labels positioned relative to actual blob centers */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: totalBlobCenter.x,
        textAlign: 'center',
        pointerEvents: 'none',
        transform: 'translateX(-50%)',
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>All Species</div>
        <div style={{ fontSize: 16, color: '#4a5568', fontWeight: 600 }}>10,000 total</div>
        <div style={{ fontSize: 14, color: '#4a5568' }}>80% continental, 20% island</div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 80,
        left: extinctBlobCenter.x,
        textAlign: 'center',
        pointerEvents: 'none',
        transform: 'translateX(-50%)',
      }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#1a202c' }}>Extinct Species</div>
        <div style={{ fontSize: 16, color: '#4a5568', fontWeight: 600 }}>1,298 total</div>
        <div style={{ fontSize: 14, color: '#4a5568' }}>12.5% continental, 87.5% island</div>
      </div>

      <svg width={dimensions.width} height={dimensions.height} style={{ display: "block" }}>
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
            fill={CONTINENT_COLOR} 
            opacity={0.9} 
            stroke={CONTINENT_COLOR}
            strokeWidth={2}
          />
        )}
        {totalIslandNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(totalIslandNodes.map(n => [n.x, n.y])))} 
            fill={ISLAND_COLOR} 
            opacity={0.9} 
            stroke={ISLAND_COLOR}
            strokeWidth={2}
          />
        )}

        {/* Extinct species segments */}
        {extinctContinentNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(extinctContinentNodes.map(n => [n.x, n.y])))} 
            fill={CONTINENT_COLOR} 
            opacity={0.9} 
            stroke={CONTINENT_COLOR}
            strokeWidth={2}
          />
        )}
        {extinctIslandNodes.length > 2 && (
          <path 
            d={line(d3.polygonHull(extinctIslandNodes.map(n => [n.x, n.y])))} 
            fill={ISLAND_COLOR} 
            opacity={0.9} 
            stroke={ISLAND_COLOR}
            strokeWidth={2}
          />
        )}
      </svg>
    </div>
  );
} 