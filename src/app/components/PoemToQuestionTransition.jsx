import React, { useState, useEffect, useRef } from 'react';
import PoemDisplay from './PoemDisplay';

export default function PoemToQuestionTransition({ children }) {
  const [showCurtain, setShowCurtain] = useState(false);
  const curtainRef = useRef();

  useEffect(() => {
    const onScroll = () => {
      if (!curtainRef.current) return;
      const curtainTop = curtainRef.current.getBoundingClientRect().top;
      // When the top of the grey segment reaches the center of the viewport, show the curtain
      setShowCurtain(curtainTop <= window.innerHeight / 2);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section style={{ position: 'relative', width: '100vw', minHeight: '300vh', background: '#F7FAFB', margin: 0, padding: 0 }}>
      {/* Fixed, centered poem */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'white',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <PoemDisplay />
      </div>
      {/* Grey segment in normal flow */}
      <div
        ref={curtainRef}
        style={{
          width: '100vw',
          minHeight: '300vh',
          background: '#F7FAFB',
          marginTop: '100vh',
          zIndex: 1,
        }}
      >
        {children}
      </div>
      {/* Fixed grey curtain that covers the poem when scrolling */}
      {showCurtain && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#F7FAFB',
            zIndex: 20,
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
          }}
        />
      )}
    </section>
  );
} 