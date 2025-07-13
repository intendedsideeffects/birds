"use client";
import dynamic from 'next/dynamic';

const VoronoiProportionComparison = dynamic(() => import('../VoronoiProportionComparison'), {
  ssr: false,
  loading: () => <div>Loading Voronoi chart...</div>,
});

export default function VoronoiPage() {
  return (
    <VoronoiProportionComparison />
  );
} 