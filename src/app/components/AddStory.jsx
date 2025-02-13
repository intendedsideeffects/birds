import React, { useState } from 'react'

function AddStory({ 
  setShowAddStory, 
  showAddStory, 
  setSelectedStory, 
  handleSendStory, 
  birdStories, 
  selectedStory, 
  setSelectedSpecies, 
  errorSendStory, 
  isSendStorySuccess, 
  setIsSendStorySuccess, 
  setErrorSendStory 
}) {
  return (
    <section className="zindexx min-h-screen bg-white text-black flex flex-col items-center justify-center px-4">
      <div className="zindexx max-w-4xl mx-auto text-center flex flex-col items-center justify-center mb-60">
        <label
          onClick={() => setShowAddStory(!showAddStory)}
          htmlFor="stories"
          className="cursor-pointer text-black text-3xl font-light"
        >
          ADD STORY+
        </label>

        {showAddStory && (
          <>
            <select
              className="w-[70%] bg-white text-black text-center rounded border border-black"
              id="stories"
              name="stories"
              onChange={(e) => {
                setSelectedStory(
                  () =>
                    birdStories.filter(
                      (bird) => e.target.value === bird.species
                    )[0].story || ''
                );
                setSelectedSpecies(e.target.value);
                setIsSendStorySuccess(false);
                setErrorSendStory('');
              }}
            >
              {birdStories
                ?.filter(
                  (story, index, birdStoriesArray) =>
                    index === birdStoriesArray.findIndex((s) => s.species === story.species)
                )
                .map((stories) => (
                  <option key={stories.stories} value={stories.species}>
                    {stories.species}
                  </option>
                ))}
            </select>
            <br />
            <br />
            <textarea
              rows={10}
              className="m-8 border border-black p-2"
              type="text"
              placeholder="Add a story"
              value={selectedStory}
              onChange={(e) => setSelectedStory(e.target.value)}
            />
            <button
              onClick={handleSendStory}
              className="rounded-full text-white bg-black font-bold px-9 py-1"
            >
              Send
            </button>
            {isSendStorySuccess ? (
              <p className="text-black">Story Updated <span className="bg-black text-white px-1">✓</span></p>
            ) : null}
            {errorSendStory ? (
              <p className="text-black">{errorSendStory.message} <span className="text-black">✗</span></p>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default AddStory
