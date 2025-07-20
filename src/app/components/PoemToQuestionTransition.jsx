import React from 'react';
import PoemDisplay from './PoemDisplay';

export default function PoemToQuestionTransition({ children }) {
  return (
    <section
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '200vh',
        background: '#F7FAFB', // Light grey background for the whole section
        margin: 0,
        padding: 0,
      }}
    >
      {/* Sticky Poem Section (white background, centered) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100vw',
          height: '100vh',
          background: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <PoemDisplay />
      </div>
      {/* Slide-up Section (content that scrolls up and covers the poem) */}
      <div
        style={{
          width: '100vw',
          minHeight: '100vh',
          zIndex: 1, // Lower than the sticky poem
        }}
      >
        {children}
      </div>
    </section>
  );
} 