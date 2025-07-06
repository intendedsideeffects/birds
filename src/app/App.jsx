"use client"
import { useState, useEffect, useMemo, useCallback, useLayoutEffect } from 'react';
import { debounce } from 'lodash';
import { BirdLoader } from './components/Bird-loader';
import historicalEvents from "../app/data/historicalPoints"
import birdArr from './data/birdArray';
import LabelsLeftPanel from './components/LabelsLeftPanel';
import PlotsScatterChart from './components/PlotsScatterChart';
import AddStory from './components/AddStory';
import processHistoricalData from './utils/processHistoricalData';
import processFutureData from './utils/processFutureData';
import { supabase } from './utils/supabaseClient';

const ExtinctSpeciesViz = ({ setBirdStories }) => {
  const [data, setData] = useState([]);
  const [timelineData, setTimelineData] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [prevDotCount, setPrevDotCount] = useState(0)
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [dotsRendered, setDotsRendered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Add state and handlers for AddStory
  const [selectedStory, setSelectedStory] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [isSendStorySuccess, setIsSendStorySuccess] = useState(false);
  const [errorSendStory, setErrorSendStory] = useState("");

  // State for the floating Add Story form visibility
  const [showFloatingAddStory, setShowFloatingAddStory] = useState(false);

  const STATUS_HEIGHT = 12500;
  const STATUS_WIDTH = 1600;
  
  
 
  const getYearPosition = (year) => {
    return ((2200 - year) / (2200 - 1500)) * STATUS_HEIGHT;
  };

  //in case the app is to slow it removes some dots to get the aplication decently working
   const removeRandomDots = (data) => {
     const dotsToRemove = Math.floor(data.length * 0.4);
     const shuffled = [...data].sort(() => 0.5 - Math.random());
     return shuffled.slice(0, data.length - dotsToRemove);
   };
  
  
  //gets the data form the bird api file and puts it in the proper form in the right variables
  //variables; birdStories(for the addStory functionality), timelineData, Data(the dots, composed of hitoricalData, futureData and birdsArr),
  const loadData = async () => {
    try {
      // Fetch historical data
      const historicalResponse = await fetch('/api/birds');
      const historicalData = await historicalResponse.json();
      const processedHistorical = processHistoricalData(historicalData);

      // Fetch future data from Supabase
      const { data: futureRaw, error } = await supabase.from('future_stories').select('*');
      let processedFuture = [];
      if (!error && futureRaw) {
        processedFuture = processFutureData(futureRaw);
      } else if (error) {
        console.error('Error fetching future data:', error);
      }

      setData([
        ...removeRandomDots([...processedHistorical, ...processedFuture]),
        ...birdArr,
      ]);

      const timelineMarks = [];
      for (let year = 1500; year <= 2200; year += 100) {
        timelineMarks.push({
          x: STATUS_WIDTH / 2,
          y: getYearPosition(year),
          label: year.toString(),
          event: historicalEvents.find((e) => e.year === year)?.text || '',
        });
      }
      setTimelineData(timelineMarks);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  

//this function runs once at the beguinig to set an event listener to hear for window size changes to calculate wich dots to render
  useEffect(() => {
    setWindowHeight(window.innerHeight);

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //this function is used to optimize the rendering of the dots to help the performance of the scatter chart
  //it is used together with visibleData to render de dots depending on the scroll position
  const handleScroll = () => {
    const visibleDotsCount = visibleData.length;
    setScrollPosition(window.scrollY);
  } 
  

  //this sets a lisener event whenever you scroll down and executes the handleScroll funciton when you scroll
  useEffect(() => {
  const debouncedScroll = debounce( handleScroll, 10);
  window.addEventListener('scroll', debouncedScroll , { passive: true });
  return () => window.removeEventListener('scroll', debouncedScroll);
  }, [handleScroll]);


//get the birds data from the backend(the folder bird inside the api folder)
  useEffect(() => {
    loadData();
  }, []);
  //if the Scatter Chart is not rendered yet display a loading state(useLayoutEffect comes from React directly)
    useLayoutEffect(() => {
      setMounted(true);
    }, []);

  const visibleData = useMemo(() => {
    if (!windowHeight) return [];
    const stableViewportStart = STATUS_HEIGHT - (scrollPosition + windowHeight) -12000;
    const stableViewportEnd = STATUS_HEIGHT - scrollPosition +3300
    const preRenderEnd = stableViewportStart // Pre-render buffer
    return data.filter((dot) => {
      // Keep dots in current viewport stable
      if (dot.y <= stableViewportEnd && dot.y >= stableViewportStart) {
        return true;
      }
      // Pre-render dots below viewport
      if (dot.y >= preRenderEnd && dot.y < stableViewportStart) {
        return true;
      }
      return false;
    });
  }, [data, scrollPosition]);

  //this function is run at whenever the visibleDots count changes to ensure a smooth visual user experience
  //whenever there is a significant amount of dots to render it sets the loading state and lead the new dots
  useEffect(() => {
   const currentCount = visibleData.length;
   const dotDelta = Math.abs(currentCount - prevDotCount);

   if (dotDelta > 400) {
     if (visibleData.length > 0) {
       if (!isLoading) {
         window.requestAnimationFrame(() => {
           setIsLoading(true);
         });
       }
       const visibleDotsCount = visibleData.length;
       const processingTime = Math.min(visibleDotsCount * 0.2, 1000);
       const renderTimer = setTimeout(() => {
         setDotsRendered(true);
         setTimeout(() => {
           window.requestAnimationFrame(() => {
             setIsLoading(false);
           });
         }, processingTime);
       }, 100); // Adjust timing based on your needs

       return () => clearTimeout(renderTimer);
     }
   }
      setPrevDotCount(currentCount);
  }, [visibleData]);

  // Reset dotsRendered when scroll position changes
  useEffect(() => {
    setDotsRendered(false);
  }, [scrollPosition]);
  
  const toggleOpen = useCallback(() => {
    setIsLegendOpen(prevState => !prevState);
  }, []);

  const handleSendStory = async () => {
    try {
      // Find the selected bird in the data array
      const selectedBird = data.find(bird => bird.species === selectedSpecies);
      
      // Determine if the bird is from future data
      const isFuture = selectedBird?.isFuture || false;

      const response = await fetch('/api/birds', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ species: selectedSpecies, story: selectedStory, isFuture: isFuture }), // Include isFuture flag
      });
      const result =await response.json();
      setIsSendStorySuccess(result.status === 200 ? true: false);
    } catch (error) {
      setErrorSendStory(error);
      console.error('Error sending story:', error);
    }
  };

  return mounted ? (
    <>
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          width: '100%',
          backgroundColor: 'white',
          color: 'black',
          position: 'relative',
        }}>
        <LabelsLeftPanel isOpen={isLegendOpen} toggleOpen={toggleOpen}
          // Pass AddStory related props to LabelsLeftPanel
          setSelectedStory={setSelectedStory}
          handleSendStory={handleSendStory}
          birdStories={data.filter(d => d.story)} // Assuming 'data' contains all bird data with stories
          selectedStory={selectedStory}
          setSelectedSpecies={setSelectedSpecies}
          errorSendStory={errorSendStory}
          isSendStorySuccess={isSendStorySuccess}
          setIsSendStorySuccess={setIsSendStorySuccess}
          setErrorSendStory={setErrorSendStory}
        />
        <PlotsScatterChart timelineData={timelineData} visibleData={visibleData} />
        {/* Floating Add Story Component */}
        <div
          style={{
            position: 'fixed', // Use fixed positioning for floating
            top: '20px', // Align with the top of the legend panel
            left: showFloatingAddStory ? '20px' : '-360px', // Toggle left position based on visibility
            zIndex: 10, // Ensure it's above the scatterplot
            width: '400px', // Match the legend panel width
            transition: 'left 0.3s ease', // Add transition for smooth animation
          }}>
          {/* Button to toggle floating Add Story form visibility (styled as a tab) */}
          <div className="panel-tab" onClick={() => setShowFloatingAddStory(!showFloatingAddStory)}
            style={{
              position: 'absolute',
              right: '-40px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '40px',
              height: '120px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid black',
              borderLeft: 'none',
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
          >
            <span style={{
              writingMode: 'vertical-rl',
              textOrientation: 'upright',
              color: 'black',
              textTransform: 'uppercase',
              fontSize: '14px',
              fontWeight: 'bold',
            }}>
              ADD STORY+
            </span>
          </div>
          {/* Content area for the floating Add Story form */}
          <div style={{ 
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)', // Add background like the legend content
              height: 'calc(100vh - 40px)', // Make height fill remaining space (adjust 40px if needed for top/bottom spacing)
              overflowY: 'auto', // Add scroll if content overflows
            }}>
            <AddStory
              setSelectedStory={setSelectedStory}
              handleSendStory={handleSendStory}
              birdStories={data} // Pass the full data array
              selectedStory={selectedStory}
              setSelectedSpecies={setSelectedSpecies}
              errorSendStory={errorSendStory}
              isSendStorySuccess={isSendStorySuccess}
              setIsSendStorySuccess={setIsSendStorySuccess}
              setErrorSendStory={setErrorSendStory}
              isVisible={true} // Form should be visible when panel is out
            />
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default ExtinctSpeciesViz;
