"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { VideoPlayer } from './components/video-player';
import AddStory from './components/AddStory';
import NewsFooter from './components/NewsFooter';
import ChronologyLoss from './components/ChronologyLossSection';
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
  const [showAddStory, setShowAddStory] = useState(false);
  const [isSendStorySuccess, setIsSendStorySuccess] = useState(false)
  const [errorSendStory, setErrorSendStory] = useState("")

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
  }, [])
  
  const handleSendStory = async () => {
    try {
      const response = await fetch('/api/birds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({species:selectedSpecies, story:selectedStory }),
      });
      const result =await response.json()
      setIsSendStorySuccess(result.status === 200 ? true: false)
    } catch (error) {
      setErrorSendStory(error)
      console.error('Error sending story:', error);
    }
  }
    
  return (
    <div>
      <div className="zindexx relative min-h-screen">
        {/* Video Section */}
        <VideoPlayer />
        {/* Chronology of Loss legend Section */}
        <ChronologyLoss />
      </div>
      {/*Scatter-Chart Section */}
      <DynamicChart2 setBirdStories={setBirdStories} />
      {/*Adding Story Section */}
      <AddStory
        setShowAddStory={setShowAddStory}
        showAddStory={showAddStory}
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
      <MiroSection />
      <NewsFooter news={news} />
    </div>
  );
}
