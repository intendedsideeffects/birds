"use client"
import { useState, useEffect, useMemo, useCallback, useLayoutEffect, useRef } from 'react';
import { debounce } from 'lodash';
import historicalEvents from "../data/historicalPoints"
import birdArr from '../data/birdArray';
import PlotsScatterChart from './PlotsScatterChart';
import processHistoricalData from '../utils/processHistoricalData';
import processFutureData from '../utils/processFutureData';
import { supabase } from '../utils/supabaseClient';

const ExtinctSpeciesViz = () => {
  const [data, setData] = useState([]);
  const [timelineData, setTimelineData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const scatterSectionRef = useRef(null);
  // Remove sectionTop and use relative scroll position
  const [containerScroll, setContainerScroll] = useState(0);

  const STATUS_HEIGHT = 12500;
  const STATUS_WIDTH = 1600;
  
  const getYearPosition = (year) => {
    return ((2200 - year) / (2200 - 1500)) * STATUS_HEIGHT;
  };

   const removeRandomDots = (data) => {
     const dotsToRemove = Math.floor(data.length * 0.4);
     const shuffled = [...data].sort(() => 0.5 - Math.random());
     return shuffled.slice(0, data.length - dotsToRemove);
   };
  
  const loadData = async () => {
    try {
      const historicalResponse = await fetch('/api/birds');
      const historicalData = await historicalResponse.json();
      const processedHistorical = processHistoricalData(historicalData);

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
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
    setWindowHeight(window.innerHeight);

    const handleResize = () => setWindowHeight(window.innerHeight);
    const debouncedScroll = debounce(() => {
      if (scatterSectionRef.current) {
        setContainerScroll(scatterSectionRef.current.getBoundingClientRect().top);
      }
      setScrollPosition(window.scrollY);
    }, 10);
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', debouncedScroll , { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', debouncedScroll);
    };
  }, []);

  useLayoutEffect(() => {
    setMounted(true);
  }, [isLoading]);

  if (!mounted) {
    return <div style={{ height: '100vh' }} />;
  }

  // Bypass all scroll/visibility logic for now
  const visibleData = data;

  return (
    <div ref={scatterSectionRef} style={{ width: '100vw', maxWidth: '100%', overflow: 'visible' }}>
      {isLoading ? (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading chart data...</div>
      ) : (
        <PlotsScatterChart timelineData={timelineData} visibleData={visibleData} />
      )}
    </div>
  );
};

export default ExtinctSpeciesViz; 