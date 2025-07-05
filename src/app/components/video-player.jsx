'use client';

import { useState, useRef } from 'react';

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef();



  const togglePlay =() =>{
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div className="relative w-full h-[99.9vh] flex flex-col justify-center items-center overflow-hidden" style={{ top: 0 }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover object-center"
        loop
        muted
        playsInline
        autoPlay={true}>
        <source src="/Birds_Final_UHD_noHUD.mp4" type="video/mp4" />
      </video>
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
