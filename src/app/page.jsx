"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { VideoPlayer } from './components/video-player';
// import NewsFooter from './components/NewsFooter';
// import ChronologyLoss from './components/ChronologyLossSection';
import MiroSection from './components/MiroSection';
import PoemDisplay from './components/PoemDisplay';

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
      {/* Video Player positioned at the top */}
      <VideoPlayer />

      {/* Large white gap / Poem Display */}
      <PoemDisplay />

      {/* Content container for Scatterplot and Add Story */}
      <div id="content-container" className="relative z-10 w-full items-center justify-center font-mono text-sm pb-96 mt-20">
        {/* Scatterplot Section */}
        <DynamicChart2 setBirdStories={setBirdStories} />

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
