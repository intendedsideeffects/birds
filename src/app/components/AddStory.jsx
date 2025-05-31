import React from 'react'

function AddStory({
  setSelectedStory,
  handleSendStory,
  birdStories,
  selectedStory,
  setSelectedSpecies,
  errorSendStory,
  isSendStorySuccess,
  setIsSendStorySuccess,
  setErrorSendStory,
  isVisible
}) {
  return (
    <section className="zindexx bg-white text-black px-4">
      <div className="zindexx">
        {isVisible && (
          <>
            <select
              className="w-[70%] bg-white text-black text-center rounded border border-black mx-auto"
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
                .filter(bird => bird.common_name !== null && bird.common_name !== undefined && bird.common_name !== '-')
                .sort((a, b) => {
                  const nameA = a.common_name || '';
                  const nameB = b.common_name || '';
                  return nameA.localeCompare(nameB);
                })
                .map((stories) => (
                  <option key={stories.species} value={stories.species}>
                    {stories.common_name || stories.species}
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
