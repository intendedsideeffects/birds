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
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import DonutChart from './components/DonutChart';

const DynamicChart2 = dynamic(() => import('./App'), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
  
});

export default function Home() {
  const [birdStories, setBirdStories] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchBirds = async () => {
      try {
        const res = await fetch('/api/birds');
        if (!res.ok) {
          throw new Error(`Error fetching birds: ${res.status}`);
        }
        const data = await res.json();
        setBirdStories(data);
      } catch (error) {
        console.error('Failed to fetch historical birds:', error);
      }
    };

    fetchBirds();
  }, []);

  const fetchNews = async () => {
    try {
      const responseNews = await fetch('/api/news');
      const dataNews = await responseNews.json();
      setNews(dataNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen">
      {/* Video at the top */}
      <VideoPlayer />
      {/* Poem below the video */}
      <PoemDisplay />

      {/* Full-screen transition phrase */}
      <section className="w-full h-screen flex justify-center items-center">
        <span className="text-4xl md:text-6xl font-light italic text-black animate-fadeIn text-center px-4">
          If we are here, now, can we face the numbers?
        </span>
      </section>

      {/* Hero section with video and poem overlay */}
      {/* <HeroOverlay /> */}

      {/* Content container for Scatterplot and Add Story */}
      <div id="content-container" className="relative z-10 w-full items-center justify-center font-mono text-sm pb-96 mt-20">
        {/* Storytelling and charts section */}
        <StorytellingSection />

        {/* Transition to loss of stories/sound/memory */}
        <TransitionToLossSection />

        {/* Scatterplot Section */}
        <DynamicChart2 setBirdStories={setBirdStories} />

        {/* Extinction risk and prognosis text as three scrollable segments */}
        <section className="w-full font-arial-sans">
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-4xl md:text-5xl font-bold text-[#e0b800] text-center max-w-4xl">
              Over 1,400 bird species are currently threatened with extinction.
            </p>
          </div>
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-3xl md:text-4xl text-[#e0b800] text-center max-w-3xl">
              If current trends continue, scientists project that up to <span className="font-bold">30%</span> of all bird species could be extinct or facing extinction by 2100.
            </p>
          </div>
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-3xl md:text-4xl text-[#e0b800] text-center max-w-3xl">
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
      {/* Add yellow donut chart and title at the very bottom */}
      <section className="w-full max-w-6xl mx-auto py-32 px-8 flex flex-col items-center font-arial-sans">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 font-arial-sans text-left mx-auto" style={{maxWidth: '900px', color: '#e0b800'}}>
          Nearly half of all bird species are in trouble, with many facing an uncertain future. This represents a critical moment for conservation efforts worldwide.
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
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
      </section>
    </main>
  );
}
