import React, { useState, useEffect, useRef } from 'react';
import PoemDisplay from './PoemDisplay';

export default function PoemToQuestionTransition({ children }) {
  return (
    <section style={{ width: '100vw', minHeight: '200vh', background: '#F7FAFB', margin: 0, padding: 0 }}>
      {/* Poem as a normal block element, centered on white */}
      <div
        style={{
          width: '100vw',
          minHeight: '100vh',
          background: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PoemDisplay />
      </div>
      {/* Grey segment for plots/content */}
      <div
        style={{
          width: '100vw',
          minHeight: '100vh',
          background: '#F7FAFB',
        }}
      >
        {children}
      </div>
    </section>
  );
} 