import React from 'react';
import PoemDisplay from './PoemDisplay';

const PoemToQuestionTransition = ({ children }) => {
  return (
    <section style={{ position: 'relative', height: '210vh', width: '100%', background: 'white' }}>
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
          background: 'white',
        }}
      >
        <div style={{ width: '100%' }}>
          <PoemDisplay />
        </div>
      </div>
      {/* Opaque white overlay to cover poem after scrolling, with content at the top */}
      <div
        style={{
          position: 'absolute',
          top: '100vh', // Move overlay further down
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
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default PoemToQuestionTransition; 