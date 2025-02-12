import React,{useRef, useState} from 'react'
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

    
    
    
    const handleMouseEnter = (dot) => {
    if (dot.highlighted && !isPlaying) {
        setIsPlaying(true);
        setHoveredDot(dot);
        audioRef.current = new Audio(dot.sound);
        audioRef.current
        .play()
        .then(() => {})
        .catch((error) => {
            if (error.name !== 'AbortError') {
            console.error('Error playing audio:', error);
            }
        });
    }
    };

    const handleMouseLeave = (dot) => {
    if (isPlaying && hoveredDot === dot) {
        audioRef.current.pause();
        setIsPlaying(false);
        setHoveredDot(null);
    }
    };

  return (
    <div
      id="plot-container"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}>
      {/* {isLoading && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: STATUS_WIDTH,
              height: windowHeight,
              zIndex: 1000,
              pointerEvents: 'none',
            }}>
            <BirdLoader />
          </div>
        )} */}

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
          tick={{ fontSize: 18, fill: '#555', textAnchor: 'start' }}
          width={80}
        />
        <Tooltip content={<CustomTooltip />} />

        <Scatter
          data={timelineData}
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
                    fill="#666"
                    fontSize="14">
                    {line}
                  </text>
                ))}
              </g>
            );
          }}
        />

        <Scatter
          data={visibleData}
          shape={(props) => (
            <FloatingDot
              cx={props.cx}
              cy={props.cy}
              r={props.payload.size}
              payload={props.payload}
              fill={getRegionColor(props.payload.status)}
              onMouseEnter={() => handleMouseEnter(props.payload)}
              onMouseLeave={() => handleMouseLeave(props.payload)}
            />
          )}
        />
      </ScatterChart>
    </div>
  );
}

export default PlotsScatterChart
