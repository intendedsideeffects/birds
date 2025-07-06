import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';
import './AnimatedLineChart.css'; // Import the CSS for transparency

const ANIMATION_DURATION = 29000; // ms, 29 seconds
const PAUSE_DURATION = 1000; // ms, 1 second pause before looping

const FIXED_Y_DOMAIN_FACTOR = 1.1; // 10% higher than max

const AnimatedLineChart = ({ startAnimation = false, overlay = false }) => {
  const [data, setData] = useState([]);
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [fixedYMax, setFixedYMax] = useState(1000);

  useEffect(() => {
    Papa.parse('/bird_extinction_with_prognosis.csv', {
      download: true,
      header: true,
      complete: (results) => {
        let parsed = results.data
          .filter(row => row.start_year && row.birds_falling)
          .map(row => ({
            start_year: +row.start_year,
            birds_falling: +row.birds_falling
          }));
        // Remove cutoff at 2025 to show all data
        // Accumulate birds_falling
        let cumulative = 0;
        parsed = parsed.map(d => {
          cumulative += d.birds_falling;
          return { ...d, birds_falling: cumulative };
        });
        setData(parsed);
        // Set fixed y max
        const maxY = parsed.length > 0 ? Math.max(...parsed.map(d => d.birds_falling)) : 1000;
        setFixedYMax(Math.ceil(maxY * FIXED_Y_DOMAIN_FACTOR));
      }
    });
  }, []);

  useEffect(() => {
    if (!data.length || !startAnimation) return;
    setHasStarted(true);
    let frameId;
    let pausedTimeout;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      const pointsToShow = Math.floor(progress * data.length);
      setDisplayedPoints(pointsToShow);
      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
        animationRef.current = frameId;
      } else {
        setIsPaused(true);
        pausedTimeout = setTimeout(() => {
          setDisplayedPoints(0);
          setIsPaused(false);
          startTimeRef.current = null;
          animationRef.current = requestAnimationFrame(animate);
        }, PAUSE_DURATION);
      }
    };

    if (!isPaused) {
      frameId = requestAnimationFrame(animate);
      animationRef.current = frameId;
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (pausedTimeout) clearTimeout(pausedTimeout);
      startTimeRef.current = null;
    };
  }, [data, isPaused, startAnimation]);

  // For debugging: log the animated data and displayedPoints
  useEffect(() => {
    if (hasStarted) {
      console.log('Animated data:', data.slice(0, displayedPoints));
      console.log('Displayed points:', displayedPoints);
    }
  }, [hasStarted, data, displayedPoints]);

  // X axis ticks in 1000-year steps
  const getXTicks = () => {
    if (!data.length) return [];
    const min = Math.min(...data.map(d => d.start_year));
    const max = Math.max(...data.map(d => d.start_year));
    const ticks = [];
    for (let t = Math.ceil(min / 1000) * 1000; t <= max; t += 1000) {
      ticks.push(t);
    }
    return ticks;
  };

  return (
    <div
      className={overlay ? "animated-line-chart-container" : "chart-transparent-debug"}
      style={{
        width: '100%',
        height: 400,
        position: overlay ? 'absolute' : 'relative',
        left: 0,
        right: 0,
        bottom: overlay ? 0 : 'auto',
        zIndex: overlay ? 20 : 'auto',
        pointerEvents: overlay ? 'none' : 'auto',
        background: 'none',
      }}
    >
      {/* Usage: Place this component as a child of the video container with overlay=true and control startAnimation via video onPlay */}
      <ResponsiveContainer className="animated-line-chart-svg" style={{ background: 'transparent' }}>
        <LineChart 
          data={hasStarted ? data.slice(0, displayedPoints) : [{ start_year: 0, birds_falling: 0 }, { start_year: 1, birds_falling: 100 }]}
          style={{ background: 'transparent' }}
        >
          <XAxis
            dataKey="start_year"
            type="number"
            domain={['dataMin', 'dataMax']}
            ticks={getXTicks()}
            stroke="#000"
            tick={{ fill: '#000' }}
            label={{ value: 'Year', position: 'insideBottom', fill: '#000', dy: 10 }}
          />
          <YAxis
            dataKey="birds_falling"
            stroke="#000"
            tick={{ fill: '#000' }}
            label={{ value: 'Birds Falling (Cumulative)', angle: -90, position: 'insideLeft', fill: '#000', dx: -10 }}
            domain={[0, fixedYMax]}
          />
          <Tooltip contentStyle={{ color: '#000', background: 'rgba(255,255,255,0.7)', border: '1px solid #000' }} itemStyle={{ color: '#000' }} labelStyle={{ color: '#000' }} />
          <Line
            type="monotone"
            dataKey="birds_falling"
            stroke="#000"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedLineChart; 