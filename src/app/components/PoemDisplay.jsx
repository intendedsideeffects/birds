'use client';

import React from 'react';

const poemBlocks = [
  [
    "LOSS",
  ],
  [
    "Some losses don't happen in a single moment.",
    "They unfold slowly, across generations.",
    "Too quiet to notice.",
    "Too vast to hold.",
  ],
  [
    "This project is an attempt to feel that loss.",
  ],
  [
    "A swarm of birds flies across a timeline.",
    "As time passes, birds begin to fall.",
  ],
  [
    "At first, just a few.",
    "Then many.",
    "Until it rains.",
  ],
  [
    "Each fallen bird marks a species lost.",
    "A story lost.",
    "A sound lost.",
  ],
  [
    "Slowness allows grief.",
    "Scroll to enter a space of mourning.",
  ],
  [
    "Each dot in the scatterplot is a species.",
    "Some hold names. Some hold stories.",
    "Some still carry sound.",
  ],
  [
    "Hover to listen. Hover to remember.",
  ],
  [
    "At the bottom, you can add a story.",
    "Your words will shift a dot,",
    "join the archive,",
    "keep a memory alive.",
  ],
  [
    "This is not just data.",
    "It is a mourning ground—",
    "an invitation to feel,",
    "to witness,",
    "to care.",
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