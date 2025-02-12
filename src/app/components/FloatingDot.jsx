"use client";

import React,{ useState, useEffect, useMemo } from 'react';

const Z_RANGE = 3000;

export const FloatingDot = React.memo(
  ({ cx, cy, r, payload, fill, style, onMouseEnter, onMouseLeave }) => {
    const [isHovered, setIsHovered] = useState(false);

    const zPosition = useMemo(() => {
      const seed = cx + cy; // Use position as seed
      return Math.abs(Math.sin(seed)) * Z_RANGE - Z_RANGE / 2;
    }, [cx, cy]);

    const duration = useMemo(() => {
      const seed = cx * cy;
      return 6 + Math.abs(Math.cos(seed)) * 4;
    }, [cx, cy]);

    const floatPattern = useMemo(() => {
      return Math.floor((cx + cy) % 3);
    }, [cx, cy]);

    const scale = (Z_RANGE + zPosition) / Z_RANGE;
    const baseSize = r * 1.5;
    const hitboxSize = baseSize * 3;
    const opacity = 1.0; // Set opacity to full
    const blur = Math.max(0, (1 - scale) * 2);

    const groupStyle = {
      cursor: 'pointer',
      animation: isHovered ? 'none' : `none`,
      zIndex: 20,
    };

    return (
      <g
        style={groupStyle}
        onMouseEnter={() => {
          setIsHovered(true);
          onMouseEnter();
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onMouseLeave();
        }}>
        {/* Main dot */}
        <circle
          cx={cx}
          cy={cy}
          r={isHovered ? baseSize * 3 : baseSize}
          fill={fill}
          style={{
            opacity,
          }}
        />

        {/* Hitbox (invisible but handles hover) */}
        <circle
          cx={cx}
          cy={cy}
          r={hitboxSize}
          fill="transparent"
          style={{ pointerEvents: 'all' }}
        />

        {/* Hover ring indicator */}
        {isHovered && (
          <circle
            cx={cx}
            cy={cy}
            r={hitboxSize}
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeOpacity="0.1"
          />
        )}
      </g>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.cx === nextProps.cx &&
      prevProps.cy === nextProps.cy &&
      prevProps.r === nextProps.r
    );
  }
);


