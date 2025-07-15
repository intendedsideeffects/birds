"use client";
import dynamic from "next/dynamic";

const SpilhausMap = dynamic(() => import("../SpilhausMap"), { ssr: false });

export default function SpilhausPage() {
  return (
    <div style={{ background: "#000", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <SpilhausMap />
    </div>
  );
} 