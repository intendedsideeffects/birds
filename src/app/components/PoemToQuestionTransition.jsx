import React from 'react';
import PoemDisplay from './PoemDisplay';

const PoemToQuestionTransition = ({ children }) => {
  return (
    <section style={{ position: 'relative', height: '210vh', width: '100%', background: 'white', marginTop: 0, borderTop: 'none' }}>
      {/* Aggressive white overlay at the top to cover any seam/line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '12px',
        background: 'white',
        zIndex: 9999,
        pointerEvents: 'none',
      }} />
      {/* Sticky Poem */}
      <div
        style={{
          position: 'sticky',
          top: '0vh',
          height: '80vh', // Taller sticky container
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          pointerEvents: 'none',
          background: 'transparent',
        }}
      >
        {/* White overlay to cover any black line at the bottom edge */}
        <div style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          height: '6px',
          background: 'white',
          zIndex: 1000,
          pointerEvents: 'none',
        }} />
        {/* White overlay to cover any black line at the video edge */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '8px',
          background: 'white',
          zIndex: 1000,
          pointerEvents: 'none',
        }} />
        <div style={{ width: '100%' }}>
          <PoemDisplay />
        </div>
      </div>
      {/* Opaque white overlay to cover poem after scrolling, with content at the top */}
      <div
        style={{
          position: 'absolute',
          top: '80vh', // Match sticky section height
          marginTop: '-1px', // Overlap by 1px to remove any line
          left: 0,
          width: '100%',
          minHeight: '105vh', // Just enough to cover the rest
          background: 'white',
          zIndex: 2,
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingTop: 0,
          boxShadow: '0 -4px 0 0 white', // Cover any seam at the top
        }}
      >
        {/* White cover to hide seam/line during scroll */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '6px',
          background: 'white',
          zIndex: 10,
          pointerEvents: 'none',
        }} />
        {children}
      </div>
    </section>
  );
};

export default PoemToQuestionTransition; 