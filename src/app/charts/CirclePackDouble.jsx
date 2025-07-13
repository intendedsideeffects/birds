"use client";
import React from "react";
import "./BubbleChart.css";

// Update bubble counts
const TOTAL_BIRDS = 10000;
const TOTAL_EXTINCT = 1298;
const CONTINENT_COLOR = "#222";
const ISLAND_COLOR = "#bfa6d8";
const WIDTH = 1100;
const HEIGHT = 700;
const PACK_RADIUS = 320;
const BUBBLE_RADIUS = 2;

function generateHexGridBubbles(count, centerX, centerY, packRadius, bubbleRadius, color, group, pack, arcStart = 0, arcEnd = 2 * Math.PI, organicJitter = 2) {
  const bubbles = [];
  const spacing = bubbleRadius * 2 + 1;
  let placed = 0;
  let ring = 0;
  while (placed < count) {
    const circumference = 2 * Math.PI * (ring * spacing);
    const numInRing = ring === 0 ? 1 : Math.floor(circumference / spacing);
    for (let i = 0; i < numInRing && placed < count; i++) {
      // For arc/segment: only place bubbles within the arc
      const angle = arcStart + ((arcEnd - arcStart) * i) / numInRing;
      const r = ring * spacing;
      let x = centerX + r * Math.cos(angle);
      let y = centerY + r * Math.sin(angle);
      // Add organic jitter
      x += (Math.random() - 0.5) * organicJitter;
      y += (Math.random() - 0.5) * organicJitter;
      // Only add if within the pack radius
      if (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) <= packRadius - bubbleRadius) {
        bubbles.push({
          color,
          group,
          x,
          y,
          idx: placed,
          globalIdx: `${pack}-${group[0].toLowerCase()}-${placed}`,
        });
        placed++;
      }
    }
    ring++;
  }
  return bubbles;
}

export default function CirclePackDouble() {
  // Left pie: 10,000 bubbles, 80% black, 20% purple
  const nLeft = 10000;
  const nLeftBlack = Math.round(nLeft * 0.8);
  const nLeftPurple = nLeft - nLeftBlack;
  // Right pie: 1,298 bubbles, 87.5% purple, 12.5% black
  const nRight = 1298;
  const nRightPurple = Math.round(nRight * 0.875);
  const nRightBlack = nRight - nRightPurple;

  // Pie chart angles (full circle, but segments for each color)
  const leftBlackStart = 0;
  const leftBlackEnd = 2 * Math.PI * 0.8;
  const leftPurpleStart = leftBlackEnd;
  const leftPurpleEnd = 2 * Math.PI;

  const rightPurpleStart = 0;
  const rightPurpleEnd = 2 * Math.PI * 0.875;
  const rightBlackStart = rightPurpleEnd;
  const rightBlackEnd = 2 * Math.PI;

  // Center positions for each pie
  const leftCenterX = WIDTH / 2 - 40;
  const rightCenterX = WIDTH + WIDTH / 2 + 40;
  const centerY = HEIGHT / 2;

  // Generate static positions for each group in each pie
  const leftBlackBubbles = generateHexGridBubbles(
    nLeftBlack,
    leftCenterX,
    centerY,
    PACK_RADIUS,
    BUBBLE_RADIUS,
    CONTINENT_COLOR,
    "Continent",
    "left",
    leftBlackStart,
    leftBlackEnd,
    2
  );
  const leftPurpleBubbles = generateHexGridBubbles(
    nLeftPurple,
    leftCenterX,
    centerY,
    PACK_RADIUS,
    BUBBLE_RADIUS,
    ISLAND_COLOR,
    "Island",
    "left",
    leftPurpleStart,
    leftPurpleEnd,
    2
  );
  const rightPurpleBubbles = generateHexGridBubbles(
    nRightPurple,
    rightCenterX,
    centerY,
    PACK_RADIUS,
    BUBBLE_RADIUS,
    ISLAND_COLOR,
    "Island",
    "right",
    rightPurpleStart,
    rightPurpleEnd,
    2
  );
  const rightBlackBubbles = generateHexGridBubbles(
    nRightBlack,
    rightCenterX,
    centerY,
    PACK_RADIUS,
    BUBBLE_RADIUS,
    CONTINENT_COLOR,
    "Continent",
    "right",
    rightBlackStart,
    rightBlackEnd,
    2
  );

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
          Where do extinct birds come from?
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
            More than 80% of bird species live on continents (<span style={{color:CONTINENT_COLOR,fontWeight:'bold'}}>black</span>), but 20% live on islands (<span style={{color:ISLAND_COLOR,fontWeight:'bold'}}>purple</span>).
          </div>
          <div style={{ marginTop: 12, fontSize: 16, color: '#444' }}>
            The left pie shows all bird species, the right pie shows extinct species. Each bubble is a species, and the pie segments show the proportion of continent vs. island species.
          </div>
          <div style={{ height: 38 }}></div>
        </div>
      </div>
      <div style={{ position: "relative", width: WIDTH * 2 + 100, height: HEIGHT, margin: "0 auto", background: "none" }}>
        {/* Left pie chart */}
        <div
          style={{ width: WIDTH, height: HEIGHT, position: "absolute", left: 0, top: 0, background: "none", borderRadius: 0, boxShadow: "none" }}
        >
          {[...leftBlackBubbles, ...leftPurpleBubbles].map((b) => (
            <div
              key={b.globalIdx}
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
                border: b.color === CONTINENT_COLOR ? "2px solid #222" : "none",
                boxShadow: "none",
                opacity: b.group === "Continent" ? 0.8 : 0.4,
              }}
              title={b.group}
            />
          ))}
        </div>
        {/* Right pie chart */}
        <div
          style={{ width: WIDTH, height: HEIGHT, position: "absolute", left: WIDTH, top: 0, background: "none", borderRadius: 0, boxShadow: "none" }}
        >
          {[...rightPurpleBubbles, ...rightBlackBubbles].map((b) => (
            <div
              key={b.globalIdx}
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
                border: b.color === CONTINENT_COLOR ? "2px solid #222" : "none",
                boxShadow: "none",
                opacity: b.group === "Continent" ? 0.8 : 0.4,
              }}
              title={b.group}
            />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 30 }} />
    </div>
  );
} 