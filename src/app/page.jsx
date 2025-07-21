'use client';

import React, { useState, useRef } from 'react';
import AnimatedExtinctionChartCopy from "./charts/AnimatedExtinctionChartCopy";
import BirdExtinctionBubbleChart from "./charts/BirdExtinctionBubbleChart";
import ExtinctSpeciesViz from './components/ExtinctSpeciesViz'; // Import the new component

const poemLines = [
  "Birds are falling from the sky.",
  "One, two - many!",
  "An exponential loss of stories and sound.",
  "And still, it goes unnoticed.",
  "\u00A0", // Non-breaking space for a visible empty line
  "Where is our mind,",
  "if not here,",
  "now,",
  "for our own collapse?",
];

export default function TestScroll() {
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef();
  const poemWrapperRef = useRef();

  // Slider state for chart
  const [barEndIndex, setBarEndIndex] = useState(0);
  const [maxBarIndex, setMaxBarIndex] = useState(0);

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

  // Handler for slider change
  const handleSliderChange = (event) => {
    setBarEndIndex(parseInt(event.target.value));
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
            A Visual Chronicle of Extinction
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
      {/* Grey segment with intro text inside */}
      <section
        style={{
          width: '100%',
          minHeight: '100vh',
          background: '#F7FAFB',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {/* Add empty space above the intro text */}
        <div style={{height: '2rem'}} />
        <div style={{height: '2rem'}} />
        <div style={{height: '2rem'}} />
        <div style={{height: '2rem'}} />
        <div style={{
          maxWidth: '700px',
          margin: '6rem auto 0 auto',
          padding: '0 1rem',
          textAlign: 'left',
          color: '#111',
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            letterSpacing: '-.01em',
            textAlign: 'left',
          }}>
            How Fast Are Birds Disappearing?
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#222',
            marginBottom: '0',
            lineHeight: 1.6,
            textAlign: 'left',
          }}>
            For millennia, bird extinctions were rare. But in the last few centuries, the rate has skyrocketed—driven by habitat loss, invasive species, and climate change. This chart shows how today’s extinction rate <b>far exceeds</b> what’s natural.
          </p>
          <div style={{ height: '1.5em' }} />
          <div style={{
            fontSize: '1.15rem',
            color: '#222',
            marginTop: '0.7em',
            lineHeight: 1.6,
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 0,
          }}>
            <span><b>Move slider</b> to see the change.</span>
            {maxBarIndex > 0 && (
              <input
                type="range"
                min="0"
                max={maxBarIndex}
                value={barEndIndex}
                onChange={handleSliderChange}
                style={{ width: '180px', marginLeft: '1em', background: 'none', pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}
                className="custom-slider"
              />
            )}
            <style>{`
              input[type='range'].custom-slider {
                -webkit-appearance: none;
                width: 180px;
                height: 6px;
                background: #ddd;
                border-radius: 3px;
                outline: none;
                margin: 0;
                padding: 0;
                pointer-events: auto;
              }
              input[type='range'].custom-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #000;
                cursor: pointer;
                box-shadow: 0 0 2px rgba(0,0,0,0.2);
                border: none;
                margin-top: -5px;
                pointer-events: auto;
              }
              input[type='range'].custom-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #000;
                cursor: pointer;
                border: none;
                pointer-events: auto;
              }
              input[type='range'].custom-slider::-ms-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #000;
                cursor: pointer;
                border: none;
                pointer-events: auto;
              }
              input[type='range'].custom-slider::-webkit-slider-runnable-track {
                height: 6px;
                background: #ddd;
                border-radius: 3px;
              }
              input[type='range'].custom-slider::-ms-fill-lower {
                background: #ddd;
                border-radius: 3px;
              }
              input[type='range'].custom-slider::-ms-fill-upper {
                background: #ddd;
                border-radius: 3px;
              }
              input[type='range'].custom-slider:focus {
                outline: none;
              }
              input[type='range'].custom-slider::-ms-tooltip {
                display: none;
              }
            `}</style>
          </div>
        </div>
        {/* Place your chart or other content here */}
        <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', marginTop: 'calc(1.5rem - 2cm)', marginBottom: '3rem' }}>
          <AnimatedExtinctionChartCopy
            barEndIndex={barEndIndex}
            setMaxBarIndex={setMaxBarIndex}
          />
        </div>
        {/* Add the new BirdExtinctionBubbleChart here */}
        <div style={{ width: '100%', maxWidth: 1400, margin: '3rem auto', padding: '0 1rem' }}>
          <BirdExtinctionBubbleChart />
        </div>
        {/* Add PlotsScatterChart below with title and description */}
        <div style={{ width: '100%', margin: '3rem 0', padding: '0 1rem' }}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto 2rem auto',
            padding: '0 1rem',
            textAlign: 'left',
            color: '#111',
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              letterSpacing: '-.01em',
              textAlign: 'left',
            }}>
              The Story of Loss
            </h2>
            <p style={{
              fontSize: '1.15rem',
              color: '#222',
              marginBottom: '0',
              lineHeight: 1.6,
              textAlign: 'left',
            }}>
              This scatterplot is an exploratory space to discover the lost birds and birds soon to be lost. Each dot is a species: <b>small dot</b> = just name, <b>medium dot</b> = story, <b>large dot</b> = sound. Explore to see which birds are gone, and which are at risk.
            </p>
          </div>
          <ExtinctSpeciesViz />
        </div>
      </section>
    </div>
  );
}
