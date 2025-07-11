'use client';

import { useState, useRef } from 'react';

export function VideoPlayer({ onPlay }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlay = () => {
    if (onPlay) onPlay();
  };

  return (
    <div
      className="relative w-full h-full flex flex-col justify-center items-center overflow-hidden"
      style={{
        top: 0,
        border: 'none',
        outline: 'none',
        margin: 0,
        padding: 0,
        background: 'white',
      }}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover object-center"
        loop
        muted
        playsInline
        autoPlay={true}
        onPlay={handlePlay}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none',
          outline: 'none',
          background: 'white',
          margin: 0,
          padding: 0,
        }}
      >
        <source src="/Birds_Final_UHD_noHUD.mp4" type="video/mp4" />
      </video>
      {/* White overlay to cover any black line at the bottom edge of the video */}
      <div style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '12px',
        background: 'white',
        zIndex: 9999,
        pointerEvents: 'none',
      }} />
      <div className="absolute inset-0 z-10 pointer-events-none" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-8xl font-bold tracking-tighter mb-8">LOSS</h1>
        <button
          size="icon"
          onClick={togglePlay}
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20">
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
