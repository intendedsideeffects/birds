import React from 'react';

export default function TestScroll() {
  return (
    <div style={{ width: '100%', minHeight: '300vh', background: '#f8f8f8' }}>
      {/* Video Section */}
      <section style={{ height: '100vh', width: '100%', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: '2rem' }}>VIDEO PLACEHOLDER</div>
      </section>

      {/* Sticky Poem Section */}
      <section style={{ position: 'sticky', top: 0, height: '80vh', width: '100%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        <div style={{ color: 'black', fontSize: '2rem' }}>POEM PLACEHOLDER</div>
      </section>

      {/* Following Section */}
      <section style={{ minHeight: '120vh', width: '100%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888', fontSize: '2rem' }}>CONTENT PLACEHOLDER</div>
      </section>
    </div>
  );
} 