'use client';

import React, { useState, useRef } from 'react';

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
    <div style={{ width: '100%', minHeight: '300vh', background: '#f8f8f8' }}>
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
          height: '6px',
          background: 'white',
          zIndex: 2,
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
          zIndex: 3,
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
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
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
              transition: 'background 0.2s',
              pointerEvents: 'auto',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </section>

      {/* Poem Section (plain white, fullscreen) */}
      <section
        style={{
          height: '100vh',
          width: '100%',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
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
            <p key={idx} style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 400, letterSpacing: '-0.01em' }}>{line}</p>
          ))}
        </div>
      </section>

      {/* Following Section */}
      <section style={{ minHeight: '120vh', width: '100%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888', fontSize: '2rem' }}>CONTENT PLACEHOLDER</div>
      </section>
    </div>
  );
} 