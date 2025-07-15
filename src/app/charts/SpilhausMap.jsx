"use client";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { geoBerghaus } from "d3-geo-projection";
import { feature } from "topojson-client";

const width = 900;
const height = 600;

export default function SpilhausMap() {
  const ref = useRef();

  useEffect(() => {
    d3.select(ref.current).selectAll("*").remove();
    const projection = geoBerghaus()
      .scale(180)
      .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
      const land = feature(world, world.objects.countries);
      const svg = d3.select(ref.current)
        .attr("width", width)
        .attr("height", height)
        .style("background", "#000");
      svg.append("g")
        .selectAll("path")
        .data(land.features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "#1e90ff")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.95);
    });
  }, []);

  return (
    <svg ref={ref}></svg>
  );
} 