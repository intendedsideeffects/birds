"use client";
import dynamic from 'next/dynamic';

const CirclePackDouble = dynamic(() => import('../CirclePackDouble'), {
  ssr: false,
  loading: () => <div>Loading circle pack visualization...</div>,
});

export default function CirclePackPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <CirclePackDouble />
      </div>
    </div>
  );
} 