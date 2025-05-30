'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

const poemBlocks = [
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
    "It begins with a sky full of birds — a moving timeline from 5000 BCE to 2200.",
    "As time passes, birds fall.",
    "At first, a few.",
    "Then many.",
    "Until it rains.", // This block has 5 lines based on your input, I will keep it as is.
  ],
  [
    "Each fallen bird marks a species lost — or likely to be lost.",
  ],
  [
    "Scroll to enter a space of grief.",
  ],
  [
    "Each dot in the scatterplot is a species.",
    "Some hold names. Some hold stories. Some still carry sound.",
    "Hover to listen. Hover to remember.",
  ],
  [
    "At the bottom, you can add a story.",
    "Your words will join the archive, shift a dot, keep a memory alive.",
  ],
  [
    "This is not just data.",
    "It is a mourning ground.",
    "An invitation to feel, to witness, and to care.",
  ]
];

const TRANSITION_DURATION = 700; // Milliseconds for fade between blocks

// Define a simple bounce keyframe animation if not already available via Tailwind
const bounceAnimation = `
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
`;

const PoemDisplay = () => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [isPoemFullyFinished, setIsPoemFullyFinished] = useState(false);

  const currentLines = useMemo(() => {
    return poemBlocks[currentBlockIndex];
  }, [currentBlockIndex]);

  // Calculate total number of stages (blocks)
  const totalStages = poemBlocks.length;
  // Calculate current stage (0-indexed)
  const currentStage = currentBlockIndex;
  // Calculate progress percentage
  const progressPercentage = ((currentStage + (isPoemFullyFinished ? 1 : 0)) / totalStages) * 100; // Progress is 100% when finished

  // Handle click to advance or replay poem
  const handleInteraction = useCallback(() => {
    if (isPoemFullyFinished) {
      // If poem is finished, reset to beginning
      setIsPoemFullyFinished(false);
      setCurrentBlockIndex(0);
      setIsFadingIn(true); // Start fade in for the first block
    } else {
      // If poem is not finished, proceed to next block
      if (currentBlockIndex < poemBlocks.length - 1) {
        setIsFadingIn(false); // Start fade out
        setTimeout(() => {
          setCurrentBlockIndex(prevIndex => prevIndex + 1);
          setIsFadingIn(true); // Start fade in for next block
        }, TRANSITION_DURATION); 
      } else { // On the last block
         setIsFadingIn(false); // Start fade out
         setTimeout(() => {
           setIsPoemFullyFinished(true); // Poem sequence finished
         }, TRANSITION_DURATION); 
      }
    }
  }, [currentBlockIndex, isPoemFullyFinished]);

  // Initial fade in for the first block of lines
  useEffect(() => {
    setIsFadingIn(true);
  }, []);

  return (
    <div 
      className="relative w-full h-[110vh] flex flex-col items-center justify-center bg-white text-black cursor-pointer"
      style={{ position: 'sticky', top: 0 }}
      onClick={handleInteraction} // Use the combined interaction handler
    >
      <div 
        className={`text-4xl text-center transition-opacity duration-${TRANSITION_DURATION} ${isFadingIn ? 'opacity-100' : 'opacity-0'}`}
        style={{ minHeight: '6em' }} // Ensure space for up to 4 lines + spacing (adjust as needed)
      >
        {currentLines.map((line, index) => (
           <p key={index}>{line}</p>
        ))}
      </div>
      
      {/* Progress Bar Container */}
      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-300">
        {/* Progress Bar Fill */}
        <div 
          className="h-full bg-black transition-width duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Subtle indicator to click or Scroll down */}
       {!isPoemFullyFinished && currentBlockIndex < poemBlocks.length - 1 && (
         <div className={`absolute bottom-10 text-base text-gray-400 transition-opacity duration-500 ${isFadingIn ? 'opacity-0' : 'opacity-100'}`}>Click anywhere to continue</div>
       )}

       {isPoemFullyFinished && (
          <div 
            className="absolute bottom-20 text-base text-black opacity-100 flex flex-col items-center"
            style={{ animation: 'bounce 1.5s infinite' }} // Apply bounce animation
          >
             <span>Click to Replay / Scroll down</span>
             <span>↓</span> {/* Downward arrow */}
          </div>
       )}
    </div>
  );
};

export default PoemDisplay; 