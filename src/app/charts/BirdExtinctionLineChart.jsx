"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from "recharts";
import * as d3 from "d3-fetch";

export default function BirdExtinctionBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    d3.csv("/bird_extinction_with_prognosis.csv", d => ({
      year: +d.start_year,
      birds_falling: +d.birds_falling
    })).then(rawData => {
      setData(rawData.filter(d => d.year <= 2025));
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, background: "#fff", zIndex: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
          <XAxis dataKey="year" type="number" domain={["dataMin", 2025]}>
            <Label value="Year" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis>
            <Label value="Birds Falling" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip />
          <Bar dataKey="birds_falling" fill="#000" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 