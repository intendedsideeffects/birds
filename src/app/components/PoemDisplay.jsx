'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

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
    "Until it rains.",
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
    "Your words will join the archive, shift a dot, keep a memory alive.", // Duplicate line for testing 5 lines
  ],
  [
    "This is not just data.",
    "It is a mourning ground.",
    "An invitation to feel, to witness, and to care.",
  ]
];

const FADE_DURATION = 1000; // Milliseconds for fade in/out
const FINAL_MESSAGE_DELAY = 500; // Delay after last block fades in before final message appears


const PoemDisplay = () => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [displayedBlockIndex, setDisplayedBlockIndex] = useState(0); // Index of the block currently displayed
  const [isFadedIn, setIsFadedIn] = useState(false); // State to control fade in of current block
  const [isPoemFinished, setIsPoemFinished] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false); // State to control final message visibility
  const timeoutRef = useRef(null); // Ref for managing timeouts
  const isInitialMount = useRef(true); // Ref to track initial mount

  // Use displayedBlockIndex to get the lines that are currently being shown
  const currentLines = poemBlocks[displayedBlockIndex];

  // Calculate total number of stages (blocks)
  const totalStages = poemBlocks.length;
  // Calculate current stage (0-indexed) based on currentBlockIndex for progress
  const currentStage = currentBlockIndex;
  // Calculate progress percentage
  const progressPercentage = ((currentStage + (isPoemFinished ? 1 : 0)) / totalStages) * 100; // Progress is 100% when finished


  // Effect to manage block transitions and initial fade in
  useEffect(() => {
    // Clear any existing timeouts to prevent conflicts
    clearTimeout(timeoutRef.current);
    setShowFinalMessage(false); // Hide final message when changing blocks or resetting

    if (isInitialMount.current) {
      // For initial mount, set displayedBlockIndex immediately and fade in after a short delay
      isInitialMount.current = false;
      setDisplayedBlockIndex(currentBlockIndex);
      timeoutRef.current = setTimeout(() => {
        setIsFadedIn(true);
      }, 50); // Short delay to allow initial render
    } else {
      // For subsequent block changes, first fade out the current content
      setIsFadedIn(false);

      // Set a timeout to update the displayed content and fade in the new block
      timeoutRef.current = setTimeout(() => {
        setDisplayedBlockIndex(currentBlockIndex); // Update content after fade out
        setIsFadedIn(true); // Start fading in the new content

        // If this is the last block, set poem finished after it fades in
        if (currentBlockIndex === poemBlocks.length - 1) {
            timeoutRef.current = setTimeout(() => {
                setIsPoemFinished(true);
            }, FADE_DURATION + FINAL_MESSAGE_DELAY); // Wait for fade in + message delay
        }

      }, FADE_DURATION); // Wait for the fade out duration before showing new content
    }

    // If resetting to the beginning after finished, clear finished state immediately
     if (currentBlockIndex === 0 && isPoemFinished) {
        setIsPoemFinished(false);
        setShowFinalMessage(false);
     }


    return () => clearTimeout(timeoutRef.current);

  }, [currentBlockIndex]); // Depend only on currentBlockIndex for transitions


  // Effect to handle showing the final message after poem finished
  useEffect(() => {
    if (isPoemFinished) {
      // showFinalMessage is set in the previous effect after last block fades in
       // We don't need a separate timeout here, just let the opacity transition handle it
    } else {
       setShowFinalMessage(false); // Hide final message if poem is no longer finished
    }
     // No timeout to clear here as the timeout is set in the previous effect
  }, [isPoemFinished]); // Depend on isPoemFinished

   // Handle click to advance or replay poem
  const handleInteraction = useCallback(() => {
    // Only allow interaction if the currently displayed content is faded in AND matches the target block index,
    // OR if the poem is finished and the final message is shown.
    const canAdvance = isFadedIn && displayedBlockIndex === currentBlockIndex && currentBlockIndex < poemBlocks.length - 1;
    const canReplay = isPoemFinished && showFinalMessage;

    if (canAdvance) {
       setCurrentBlockIndex(prevIndex => prevIndex + 1);
    } else if (canReplay) {
       setIsPoemFinished(false); // This will trigger the effect to reset block index
       setCurrentBlockIndex(0); // Explicitly set index to 0 on reset
    }
  }, [isFadedIn, isPoemFinished, currentBlockIndex, displayedBlockIndex, showFinalMessage]); // Added dependencies


  return (
    <div
      className="relative w-full h-[100vh] flex flex-col items-center justify-center bg-white text-black cursor-pointer"
      style={{ position: 'sticky', top: 0 }} // Make the container sticky
      onClick={handleInteraction} // Use the combined interaction handler
    >
      {/* Poem Blocks */}
      <div
        className={`text-4xl text-center transition-opacity duration-${FADE_DURATION}`}
        style={{
          opacity: isFadedIn ? 1 : 0,
          minHeight: '6em', // Ensure space for up to 4 lines + spacing (adjust as needed)
        }}
      >
        {/* Render content based on displayedBlockIndex */}
        {currentLines.map((line, index) => (
           <p key={index}>{line}</p>
        ))}
      </div>

      {/* Progress Bar Container */}
      {!isPoemFinished && (
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-300">
          {/* Progress Bar Fill */}
          <div
            className="h-full bg-black transition-width duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}

       {/* Final Message */}
       <div
         className={`absolute bottom-20 text-base text-black flex flex-col items-center transition-opacity duration-${FADE_DURATION}`}
         style={{ opacity: showFinalMessage ? 1 : 0 }}
       >
          <span>Click to Replay / Scroll down</span>
          <span>↓</span> {/* Downward arrow */}
       </div>
    </div>
  );
};

export default PoemDisplay; 