import React, { useState } from 'react'

function AddStory({ setShowAddStory, showAddStory, setSelectedStory, handleSendStory, birdStories, selectedStory, setSelectedSpecies, errorSendStory, isSendStorySuccess, setIsSendStorySuccess, setErrorSendStory }) {
 
  return (
    <section className=" zindexx min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="text-black zindexx max-w-4xl mx-auto text-center flex flex-col items-center justify-center mb-60">
        <label
          onClick={() => setShowAddStory(!showAddStory)}
          htmlFor="stories"
          className="cursor-pointer text-white text-3xl font-light ">
          ADD STORY+
        </label>

        {showAddStory && (
          <>
            <select
              className="w-[70%] bg-white  text-center rounded"
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
              }}>
              {birdStories
                //gets rid of duplicates
                ?.filter(
                  (story, index, birdStoriesArray) =>
                    //finds the first occurence of each bird and filters tho other ones
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
              className="m-8"
              type="text"
              placeholder="Add a story"
              value={selectedStory}
              onChange={(e) => setSelectedStory(e.target.value)}
            />
            <button
              onClick={handleSendStory}
              className="rounded-full text-black bg-gray-500 font-bold pl-9 pr-9 pt-1 pb-1">
              Send
            </button>
            {isSendStorySuccess ? (
              <p className="text-white">Story Updated ✅</p>
            ) : null}
            {errorSendStory ? (
              <p className="text-white">{errorSendStory.message} ❌</p>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}

export default AddStory
