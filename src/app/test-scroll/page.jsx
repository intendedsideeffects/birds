'use client';

import React, { useState, useRef, useEffect } from 'react';

const poemLines = [
  "Birds are falling from the sky.",
  "One, two - many!",
  "An exponential loss of stories and sound.",
  "And still, it goes unnoticed.",
  "Where is our mind,",
  "if not here,",
  "now,",
  "for our own collapse?",
];

export default function TestScroll() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef();
  const poemWrapperRef = useRef();

  // Pause/play logic for video
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

  return (
    <div style={{ width: '100%', minHeight: '300vh', background: '#f8f8f8', position: 'relative' }}>
      {/* Video Section */}
      <section style={{ position: 'relative', height: '100vh', width: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src="/Birds_Final_UHD_noHUD.mp4"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#222' }}
          autoPlay
          loop
          muted
          playsInline
        />
        {/* White overlay to cover any black line at the bottom edge */}
        <div style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '14px',
          background: 'white',
          zIndex: 10,
          pointerEvents: 'none',
        }} />
        {/* Centered LOSS title and pause/play button */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 11,
          pointerEvents: 'none',
        }}>
          <h1 style={{
            fontSize: '6rem',
            fontWeight: 700,
            letterSpacing: '-.05em',
            marginBottom: '1.5rem',
            fontFamily: 'inherit',
            textAlign: 'center',
            lineHeight: 1,
            pointerEvents: 'auto',
          }}>LOSS</h1>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#222',
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.3,
            pointerEvents: 'auto',
          }}>
            A visual narrative of bird extinction—combining science, art, and poetry to reveal what we’re losing.
          </div>
          <button
            onClick={togglePlay}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '50%',
              width: '2.2rem',
              height: '2.2rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0',
              pointerEvents: 'auto',
            }}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg width="1.2rem" height="1.2rem" viewBox="0 0 28 28" style={{ display: 'block' }}>
                <rect x="7" y="5" width="4" height="18" fill="black" />
                <rect x="17" y="5" width="4" height="18" fill="black" />
              </svg>
            ) : (
              <svg width="1.2rem" height="1.2rem" viewBox="0 0 28 28" style={{ display: 'block' }}>
                <polygon points="8,5 22,14 8,23" fill="black" />
              </svg>
            )}
          </button>
        </div>
      </section>

      {/* White overlay at the seam between video and poem */}
      <div style={{
        position: 'absolute',
        top: '100vh',
        left: 0,
        width: '100%',
        height: '14px',
        background: 'white',
        zIndex: 9999,
        pointerEvents: 'none',
      }} />

      {/* Poem Section (no overlay) */}
      <section
        ref={poemWrapperRef}
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          background: 'white',
        }}
      >
        {/* Sticky poem content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            flexDirection: 'column',
            pointerEvents: 'auto',
          }}
        >
          <div style={{
            color: 'black',
            fontSize: '1.5rem',
            maxWidth: '600px',
            textAlign: 'left',
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 400,
            lineHeight: 1.5,
            zIndex: 2,
            position: 'relative',
          }}>
            {poemLines.map((line, idx) => (
              <p key={idx} style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{line}</p>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 