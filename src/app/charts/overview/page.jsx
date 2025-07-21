"use client";

import BirdExtinctionBubbleChart from "../BirdExtinctionBubbleChart";
import BirdExtinctionLineChart from "../BirdExtinctionLineChart";
import BirdExtinctionBubbleBarChart from "../BirdExtinctionBubbleBarChart";
import CirclePackDouble from "../CirclePackDouble";
import CustomStereoMap from "../CustomStereoMap";
import VoronoiProportionComparison from "../VoronoiProportionComparison";

export default function ChartOverviewPage() {
  const charts = [
    { component: BirdExtinctionBubbleChart, name: "Bird Extinction Bubble Chart" },
    { component: BirdExtinctionLineChart, name: "Bird Extinction Line Chart" },
    { component: BirdExtinctionBubbleBarChart, name: "Bird Extinction Bubble Bar Chart" },
    { component: CirclePackDouble, name: "Circle Pack Double" },
    { component: CustomStereoMap, name: "Custom Stereo Map" },
    { component: VoronoiProportionComparison, name: "Voronoi Proportion Comparison" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "40px" }}>Chart Overview</h1>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", 
        gap: "40px",
        width: "100%"
      }}>
        {charts.map(({ component: Chart, name }) => (
          <div key={name} style={{ 
            border: "1px solid #ccc", 
            padding: "20px",
            borderRadius: "8px"
          }}>
            <h2 style={{ marginBottom: "20px" }}>{name}</h2>
            <div style={{ 
              width: "100%", 
              height: "400px", 
              overflow: "auto",
              resize: "both"
            }}>
              <Chart />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 