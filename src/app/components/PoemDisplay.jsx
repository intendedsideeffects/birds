'use client';

import React from 'react';

const poemBlocks = [
  [
    // Removed title
  ],
  [
    "Birds are falling from the sky.",
    "One, two - many!",
    "An exponential loss of stories and sound.",
    "And still, it goes unnoticed.",
  ],
  [
    "Where is our mind,",
    "if not here,",
    "now,",
    "for our own collapse?",
  ],
  // Removed last line
];

const PoemDisplay = () => {
  return (
    <div
      className="w-full text-black flex justify-center items-start"
      style={{ 
        minHeight: '100vh',
        padding: '50vh 2rem 20vh 2rem',
        backgroundColor: 'transparent',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          textAlign: 'left',
        }}
      >
        {poemBlocks.map((block, index) => (
          <div
            key={index}
            className="mb-32"
          >
            {block.map((line, lineIndex) => (
              <p 
                key={lineIndex}
                className="text-2xl mb-8 text-black"
              >
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoemDisplay; 