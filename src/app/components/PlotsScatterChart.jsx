import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip } from 'recharts';
import getRegionColor from '../data/colorPointsData';
import CustomTooltip from './CustomTooltip';
import { FloatingDot } from './FloatingDot';

const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;

function PlotsScatterChart({ timelineData, visibleData }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hoveredDot, setHoveredDot] = useState(null);

    useEffect(() => {
        const enableAudio = () => {
            if (!audioRef.current) {
                audioRef.current = new Audio();
            }
        };

        document.addEventListener("click", enableAudio, { once: true });
        return () => document.removeEventListener("click", enableAudio);
    }, []);

    const handleMouseEnter = (dot) => {
        if (dot.highlighted && !isPlaying) {
            setIsPlaying(true);
            setHoveredDot(dot);

            if (!audioRef.current) {
                audioRef.current = new Audio(dot.sound);
            } else {
                audioRef.current.src = dot.sound;
            }

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => console.log("🎵 Playing audio"))
                    .catch((error) => console.warn("⚠️ Autoplay prevented:", error));
            }
        }
    };

    const handleMouseLeave = (dot) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setHoveredDot(null);
    };

    const getStableColor = useCallback((status) => {
        return getRegionColor(status);
    }, []);

    const stabilizedData = useMemo(() => {
        return timelineData.map(d => {
            // Calculate y-coordinate for extinct birds without dates
            let yCoord = d.y;
            if (d.status === "Extinct" && !d.ext_date) {
                // Convert 2024 to the appropriate y-coordinate using the same scale
                const scale = STATUS_HEIGHT / (2200 - 1500);
                yCoord = (2200 - 2024) * scale;
            }
            
            return {
                ...d,
                fill: d.fill || getStableColor(d.status),
                size: d.size || 5,
                x: Math.round(d.x),
                y: yCoord
            };
        });
    }, [timelineData, getStableColor]);

    const stabilizedVisibleData = useMemo(() => {
        return visibleData.map(d => ({
            ...d,
            fill: d.fill || getStableColor(d.status),
            size: d.size || 5,
            x: Math.round(d.x),
            y: d.y
        }));
    }, [visibleData, getStableColor]);

    return (
        <div
            id="plot-container"
            style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                backgroundColor: 'white',
                color: 'black'
            }}>
            
            <ScatterChart
                key="main-scatter-chart"
                style={{ width: '100%' }}
                width={STATUS_WIDTH}
                height={STATUS_HEIGHT - 900}
                margin={{ top: 100, right: 190, bottom: 50, left: 30 }}>
                <XAxis
                    type="number"
                    dataKey="x"
                    domain={[-STATUS_WIDTH / 2, STATUS_WIDTH / 2]}
                    tickFormatter={(value) => Math.round(value)}
                    hide
                />
                <YAxis
                    type="number"
                    dataKey="y"
                    domain={[0, STATUS_HEIGHT]}
                    orientation="right"
                    ticks={timelineData.map((mark) => mark.y)}
                    tickFormatter={(value) => {
                        const year = Math.round(
                            2200 - (value / STATUS_HEIGHT) * (2200 - 1500)
                        );
                        return year;
                    }}
                    tick={{ fontSize: 18, fill: 'black', textAnchor: 'start' }}
                    width={80}
                />
                <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#666' }}
                    isAnimationActive={false}
                />

                <Scatter
                    data={stabilizedData}
                    shape={(props) => {
                        const text = String(props.payload.event);
                        const words = text.split(' ');
                        let lines = [];
                        let currentLine = '';
                        const maxWidth = 30;

                        words.forEach((word) => {
                            if ((currentLine + ' ' + word).length <= maxWidth) {
                                currentLine += (currentLine ? ' ' : '') + word;
                            } else {
                                lines.push(currentLine);
                                currentLine = word;
                            }
                        });
                        if (currentLine) {
                            lines.push(currentLine);
                        }

                        return (
                            <g>
                                {lines.map((line, i) => (
                                    <text
                                        key={i}
                                        x={props.cx + 100}
                                        y={props.cy + (i - (lines.length - 1) / 2) * 20}
                                        textAnchor="start"
                                        fill="black"
                                        fontSize="14">
                                        {line}
                                    </text>
                                ))}
                            </g>
                        );
                    }}
                />

                <Scatter
                    data={stabilizedVisibleData}
                    shape={(props) => (
                        <FloatingDot
                            cx={props.cx}
                            cy={props.cy}
                            r={props.payload.size}
                            payload={props.payload}
                            fill={props.payload.fill}
                            onMouseEnter={() => handleMouseEnter(props.payload)}
                            onMouseLeave={() => handleMouseLeave(props.payload)}
                        />
                    )}
                />
            </ScatterChart>
        </div>
    );
}

export default PlotsScatterChart;

