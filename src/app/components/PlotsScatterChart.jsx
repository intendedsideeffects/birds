import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Label, ReferenceArea } from 'recharts';
import getRegionColor from '../data/colorPointsData';
import CustomTooltip from './CustomTooltip';
import { FloatingDot } from './FloatingDot';

const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;

function PlotsScatterChart({ timelineData, visibleData }) {
    const PRESENT_YEAR = new Date().getFullYear();
    // For demo/fixed: const PRESENT_YEAR = 2025;
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
                const scale = STATUS_HEIGHT / (2200 - 1500);
                yCoord = (2200 - 2024) * scale;
            }
            // Determine year for this dot
            const year = d.year || d.event_year || d.ext_date || d.xYear;
            const isFuture = year && year > PRESENT_YEAR;
            return {
                ...d,
                fill: isFuture ? '#e0b800' : (d.fill || getStableColor(d.status)),
                future: !!isFuture,
                size: d.size || 5,
                x: Math.round(d.x),
                y: yCoord
            };
        });
    }, [timelineData, getStableColor]);

    const stabilizedVisibleData = useMemo(() => {
        return visibleData.map(d => {
            const year = d.year || d.event_year || d.ext_date || d.xYear;
            const isFuture = year && year > PRESENT_YEAR;
            return {
                ...d,
                fill: isFuture ? '#e0b800' : (d.fill || getStableColor(d.status)),
                future: !!isFuture,
                size: d.size || 5,
                x: Math.round(d.x),
                y: d.y
            };
        });
    }, [visibleData, getStableColor]);

    // Debug: log status values for visible dots
    useEffect(() => {
        if (stabilizedVisibleData.length > 0) {
            console.log('Dot statuses:', stabilizedVisibleData.map(d => d.status));
            console.log('First 5 dots:', stabilizedVisibleData.slice(0, 5));
        }
    }, [stabilizedVisibleData]);

    // Calculate the y position for the NOW line and future background
    const yearMin = 1500;
    const yearMax = 2200;
    const nowY = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
    const futureHeight = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
    const futureY = nowY;

    return (
        <div
            id="plot-container"
            style={{
                width: '100%',
                height: STATUS_HEIGHT + 'px',
                position: 'relative',
                backgroundColor: 'white',
                color: 'black',
                overflow: 'visible'
            }}>
            
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    key="main-scatter-chart"
                    style={{ 
                        overflow: 'visible'
                    }}
                    margin={{ top: 20, right: 310, bottom: 80, left: 30 }}>
                    {/* Vertical dashed line for NOW (PRESENT_YEAR) */}
                    <ReferenceLine
                        y={nowY}
                        stroke="#e0b800"
                        strokeDasharray="8 8"
                        strokeWidth={3}
                    >
                        <Label value="NOW" position="right" offset={10} fill="#e0b800" fontSize={22} fontWeight="bold" />
                    </ReferenceLine>
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
                            // Map y-value to year (top = 1500, bottom = 2200)
                            const year = Math.round(1500 + (value / STATUS_HEIGHT) * (2200 - 1500));
                            return year;
                        }}
                        tick={(props) => {
                            // Map y-value to year
                            const year = Math.round(1500 + (props.y / STATUS_HEIGHT) * (2200 - 1500));
                            const isFuture = year > PRESENT_YEAR;
                            return (
                                <text
                                    x={props.x + 8}
                                    y={props.y + 4}
                                    fontSize={16}
                                    fill={isFuture ? '#e0b800' : '#000'}
                                    textAnchor="start"
                                >
                                    {year}
                                </text>
                            );
                        }}
                        axisLine={(props) => {
                            // Calculate the y-pixel for PRESENT_YEAR (2025) using the same formula as the NOW line
                            const yearMin = 1500;
                            const yearMax = 2200;
                            const nowY = ((yearMax - PRESENT_YEAR) / (yearMax - yearMin)) * STATUS_HEIGHT;
                            return (
                                <g>
                                    {/* Black line from top to NOW */}
                                    <line
                                        x1={props.x}
                                        y1={0}
                                        x2={props.x}
                                        y2={nowY}
                                        stroke="#000"
                                        strokeWidth={2}
                                    />
                                    {/* Yellow line from NOW to bottom */}
                                    <line
                                        x1={props.x}
                                        y1={nowY}
                                        x2={props.x}
                                        y2={STATUS_HEIGHT}
                                        stroke="#e0b800"
                                        strokeWidth={2}
                                    />
                                </g>
                            );
                        }}
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

                            // Only make the specific event yellow
                            const isSpecialEvent =
                                props.payload.event ===
                                    'Conservative predictions expect 12.5% of all global bird species to go extinct by 2100. Many scientists expect the real number to be significantly higher.';
                            const textColor = isSpecialEvent ? '#e0b800' : '#222';

                            return (
                                <g style={{ pointerEvents: 'none' }}>
                                    {lines.map((line, i) => (
                                        <text
                                            key={i}
                                            x={props.cx + 100}
                                            y={props.cy + i * 18}
                                            textAnchor="start"
                                            fill={textColor}
                                            fontSize="16"
                                            style={{ pointerEvents: 'none' }}>
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
            </ResponsiveContainer>
        </div>
    );
}

export default PlotsScatterChart;

