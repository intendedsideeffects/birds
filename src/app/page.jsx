"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { VideoPlayer } from './components/video-player';
// import NewsFooter from './components/NewsFooter';
// import ChronologyLoss from './components/ChronologyLossSection';
import MiroSection from './components/MiroSection';
import PoemDisplay from './components/PoemDisplay';
import StorytellingSection from './components/StorytellingSection';
import TransitionToLossSection from './components/TransitionToLossSection';
// import HeroOverlay from './components/HeroOverlay';
import DonutChart from './components/DonutChart';
import QuestionTransitionSection from './components/QuestionTransitionSection';
import PoemToQuestionTransition from './components/PoemToQuestionTransition';

const DynamicChart2 = dynamic(() => import('./App'), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Video at the top */}
      <VideoPlayer />
      {/* Poem and overlay transition with chart content */}
      <PoemToQuestionTransition>
        <StorytellingSection />
      </PoemToQuestionTransition>

      {/* Hero section with video and poem overlay */}
      {/* <HeroOverlay /> */}

      {/* Content container for Scatterplot and Add Story */}
      <div id="content-container" className="relative z-10 w-full items-center justify-center font-mono text-sm pb-96 mt-20">
        {/* Transition to loss of stories/sound/memory */}
        <TransitionToLossSection />

        {/* Scatterplot Section */}
        <DynamicChart2 />

        {/* Add yellow donut chart directly under the scatterplot */}
        <section className="w-full max-w-6xl mx-auto py-32 px-8 flex flex-col items-center font-arial-sans">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 font-arial-sans text-left mx-auto" style={{color: '#e0b800', maxWidth: '900px'}}>
            Nearly half of all bird species are in trouble, with many facing an uncertain future.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '30vh' }}>
            <DonutChart
              data={[
                { name: 'Endangered', value: 23.8 },
                { name: 'Declining', value: 26.2 },
                { name: 'Stable/Increasing', value: 50 },
              ]}
              width={1200}
              height={600}
              colors={['#e0b800', '#e0b800', '#e0b800']}
              labelColor="#e0b800"
              lineColor="#e0b800"
            />
          </div>
          <div className="w-full flex flex-col items-center">
            <p className="text-3xl md:text-4xl font-bold font-arial-sans text-left mx-auto" style={{color: '#e0b800', maxWidth: '900px', marginBottom: '60vh'}}>
              Over 1,400 bird species are currently threatened with extinction. If current trends continue, scientists project that up to <span className="font-bold">30%</span> of all bird species could be extinct or facing extinction by 2100.
            </p>
            <p className="text-3xl md:text-4xl font-bold font-arial-sans text-left mx-auto" style={{color: '#e0b800', maxWidth: '900px', marginTop: 0}}>
              By 2200, this number could rise to <span className="font-bold">50%</span> of all bird species if threats are not addressed.
            </p>
          </div>
        </section>

        {/* Removed ChronologyLoss */}
        {/* Removed NewsFooter */}
        {/* <MiroSection /> */}

        {/* Removed Add Story section */}

        {/* Removed success message */}
        {/* Removed error message */}
      </div>
    </main>
  );
}
