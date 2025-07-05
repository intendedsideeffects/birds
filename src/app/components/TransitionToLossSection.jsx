import React from 'react';

export default function TransitionToLossSection() {
  return (
    <section className="w-full flex flex-col items-center justify-center py-32 px-8 font-arial-sans">
      <div className="max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">Beyond the Numbers</h2>
        <p className="text-lg md:text-2xl text-gray-700 mb-6">
          When a bird species vanishes, it's not just a number lost to history.
        </p>
        <p className="text-lg md:text-2xl text-gray-700 mb-6">
          It's the loss of a song that will never be heard again.<br/>
          The loss of stories, of memory, of meaning woven through generations.
        </p>
        <p className="text-lg md:text-xl text-gray-500">
          What does it mean to lose not just a species, but a voice in the world's chorus?
        </p>
      </div>
    </section>
  );
} 