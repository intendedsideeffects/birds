"use client";
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { spilhausSquare } from "./spilhausSquare";

const width = 928;
const height = width;
const padding = 50;

export default function MinimalistSpilhausMap() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Fill background with black
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#000";
    context.fillRect(0, 0, width, height);

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json").then(world => {
      const land = feature(world, world.objects.land);
      const projection = spilhausSquare()
        .fitExtent(
          [[padding, padding], [width - padding, height - padding]],
          { type: "Sphere" }
        );
      const path = d3.geoPath(projection, context);

      // Draw the ocean (the sphere) in blue
      context.save();
      context.beginPath();
      path({ type: "Sphere" });
      context.fillStyle = "#1e90ff";
      context.fill();
      context.restore();

      // Draw the continents in black (cut out from the ocean)
      context.save();
      context.beginPath();
      path(land);
      context.fillStyle = "#000";
      context.globalCompositeOperation = "source-over";
      context.fill();
      context.restore();
    });
  }, []);

  return <canvas ref={canvasRef} width={width} height={height} style={{ display: "block", margin: "0 auto", background: "#000" }} />;
} 