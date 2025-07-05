import React, { useState } from 'react';

// Helper to create SVG arc paths for donut segments
function describeArc(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
  const toRadians = (deg) => (deg - 90) * Math.PI / 180;
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const startOuter = [
    cx + outerRadius * Math.cos(toRadians(startAngle)),
    cy + outerRadius * Math.sin(toRadians(startAngle))
  ];
  const endOuter = [
    cx + outerRadius * Math.cos(toRadians(endAngle)),
    cy + outerRadius * Math.sin(toRadians(endAngle))
  ];
  const startInner = [
    cx + innerRadius * Math.cos(toRadians(endAngle)),
    cy + innerRadius * Math.sin(toRadians(endAngle))
  ];
  const endInner = [
    cx + innerRadius * Math.cos(toRadians(startAngle)),
    cy + innerRadius * Math.sin(toRadians(startAngle))
  ];
  return [
    'M', ...startOuter,
    'A', outerRadius, outerRadius, 0, largeArc, 1, ...endOuter,
    'L', ...startInner,
    'A', innerRadius, innerRadius, 0, largeArc, 0, ...endInner,
    'Z'
  ].join(' ');
}

// Helper to get a point at a given angle and radius
function getPoint(cx, cy, angle, radius) {
  const rad = (angle - 90) * Math.PI / 180;
  return [
    cx + radius * Math.cos(rad),
    cy + radius * Math.sin(rad)
  ];
}

const DonutChart = ({
  data,
  width = 1200,
  height = 500,
  colors = ['#e0b800', '#e0b800', '#e0b800'],
  labelColor = '#e0b800',
  lineColor = '#e0b800',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // Center the donut in the SVG
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = 170;
  const innerRadius = 110;
  const labelFontSize = 16;
  const anglePad = 0; // no gap between segments
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let angleStart = 0;

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      {/* Donut Segments */}
      {data.map((d, i) => {
        const angle = (d.value / total) * 360 - anglePad;
        const midAngle = angleStart + angle / 2;
        const isHovered = hoveredIndex === i;
        const hoverOuterRadius = isHovered ? outerRadius + 10 : outerRadius;
        const hoverInnerRadius = innerRadius;
        // Arc path
        const path = describeArc(cx, cy, hoverOuterRadius, hoverInnerRadius, angleStart, angleStart + angle);
        // Connector points (D3 style)
        // 1. Start at arc centroid (just outside the donut)
        const toRadians = (deg) => (deg - 90) * Math.PI / 180;
        const centroidRadius = (hoverOuterRadius + hoverInnerRadius) / 2;
        const centroidX = cx + centroidRadius * Math.cos(toRadians(midAngle));
        const centroidY = cy + centroidRadius * Math.sin(toRadians(midAngle));
        // 2. Outward segment: move perpendicular to arc for fixed distance
        const outwardLen = 30;
        const inflexX = centroidX + outwardLen * Math.cos(toRadians(midAngle));
        const inflexY = centroidY + outwardLen * Math.sin(toRadians(midAngle));
        // 3. Horizontal segment: left or right
        const horizontalLen = 70;
        const isRight = Math.cos(toRadians(midAngle)) >= 0;
        const labelX = inflexX + (isRight ? horizontalLen : -horizontalLen);
        const labelY = inflexY;
        angleStart += angle;
        // Set different opacities for each segment
        const opacities = [1, 0.7, 0.4];
        return (
          <g key={d.name} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
            <path
              d={path}
              fill={colors[i] || colors[0]}
              opacity={isHovered ? 1 : opacities[i]}
              style={{ transition: 'all 0.2s' }}
            />
            {/* Connector line: outward then horizontal */}
            <polyline
              points={`${centroidX},${centroidY} ${inflexX},${inflexY} ${labelX},${labelY}`}
              fill="none"
              stroke={lineColor}
              strokeWidth={2}
            />
            {/* Label */}
            <text
              x={labelX + (isRight ? 6 : -6)}
              y={labelY + 5}
              fill={labelColor}
              textAnchor={isRight ? 'start' : 'end'}
              fontSize={18}
              fontWeight={400}
              alignmentBaseline="middle"
              style={{ pointerEvents: 'none' }}
            >
              {d.name}
            </text>
          </g>
        );
      })}
      {/* Inner circle for donut effect */}
      <circle cx={cx} cy={cy} r={innerRadius - 2} fill="#fff" />
    </svg>
  );
};

export default DonutChart; 