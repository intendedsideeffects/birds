"use client";
import React from "react";
import BirdExtinctionLineChart from "../BirdExtinctionLineChart";

export default function LineChartPage() {
  return (
    <div style={{ padding: "2rem", background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        Bird Extinction Over Time
      </h1>
      <BirdExtinctionLineChart />
    </div>
  );
} 