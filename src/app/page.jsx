"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { VideoPlayer } from './components/video-player';
import AddStory from './components/AddStory';
// import NewsFooter from './components/NewsFooter';
// import ChronologyLoss from './components/ChronologyLossSection';
import MiroSection from './components/MiroSection';

const DynamicChart2 = dynamic(() => import('./App'), {
  ssr: false,
  loading: () => <div>Loading visualization...</div>,
  
});

export default function Home() {
  const [birdStories, setBirdStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [news, setNews] = useState([]);
  const [isSendStorySuccess, setIsSendStorySuccess] = useState(false);
  const [errorSendStory, setErrorSendStory] = useState("");

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

  const handleSendStory = async () => {
    try {
      const response = await fetch('/api/birds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({species:selectedSpecies, story:selectedStory }),
      });
      const result =await response.json();
      setIsSendStorySuccess(result.status === 200 ? true: false);
    } catch (error) {
      setErrorSendStory(error);
      console.error('Error sending story:', error);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Video Player positioned at the top */}
      <VideoPlayer />

      {/* Large white gap */}
      <div className="bg-white h-[200vh]"></div>

      {/* Content container for Scatterplot and Add Story */}
      <div className="relative z-10 w-full items-center justify-center font-mono text-sm pb-96">
        {/* Scatterplot Section */}
        <DynamicChart2 setBirdStories={setBirdStories} />

        {/* Removed ChronologyLoss */}
        {/* Removed NewsFooter */}
        {/* <MiroSection /> */}

        {/* Add Story section - always rendered, internal state manages form visibility */}
        <AddStory
          setSelectedStory={setSelectedStory}
          handleSendStory={handleSendStory}
          birdStories={birdStories}
          selectedStory={selectedStory}
          setSelectedSpecies={setSelectedSpecies}
          errorSendStory={errorSendStory}
          isSendStorySuccess={isSendStorySuccess}
          setIsSendStorySuccess={setIsSendStorySuccess}
          setErrorSendStory={setErrorSendStory}
        />

        {isSendStorySuccess && (
          <div className="fixed bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded z-50">
            Story sent successfully!
          </div>
        )}
        {errorSendStory && (
          <div className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded z-50">
            Error sending story: {errorSendStory}
          </div>
        )}
      </div>
    </main>
  );
}
