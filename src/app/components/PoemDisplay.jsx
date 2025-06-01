'use client';

import React from 'react';

const poemBlocks = [
  [
    "LOSS",
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
  [
    "Hold what we still can.",
  ]
];

const PoemDisplay = () => {
  return (
    <div
      className="w-full bg-white text-black"
      style={{ 
        minHeight: '100vh',
        padding: '50vh 2rem 20vh 2rem',
        backgroundColor: 'white'
      }}
    >
      <div className="max-w-3xl mx-auto">
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