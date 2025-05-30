import { supabase } from './supabaseClient';

const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;

const getYearPosition = (year) => {
  return ((2200 - year) / (2200 - 1500)) * STATUS_HEIGHT;
};

const processHistoricalData = (data) =>
  data
    ?.filter((bird) => {
      const year = parseInt(bird.ext_date);
      return bird.ext_date && bird.ext_date !== 'NA' && year >= 1500;
    })
    .map((bird) => {
      const year = parseInt(bird.ext_date);
      let y = getYearPosition(year);

      // Add slight randomization to y-position for milestone years (e.g., years divisible by 100)
      if (year % 100 === 0 && year >= 1500 && year <= 2200) {
        y += (Math.random() - 0.5) * 200; // Increase random offset range
      }

      const x =
        Math.random() * STATUS_WIDTH -
        STATUS_WIDTH / 2 +
        (Math.random() - 0.5) * 100;

      return {
        x,
        y,
        name: bird.common_name || bird.species,
        species: bird.species,
        location: bird.archip?.replace(/\*$/, '').trim() || '-',
        year,
        story: bird.story,
        size: bird.story && bird.story.trim().length > 0 ? 8 : 4,
        status: 'EX',
        tooltipStatus: bird.description,
        ext_date: bird.ext_date,
        common_name: bird.common_name,
        iucn_category_2021: bird.iucn_category_2021,
        description: bird.description,
      };
    });

export async function fetchAndProcessHistoricalData() {
  const { data, error } = await supabase.from('bird_stories').select('*');

  if (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }

  return processHistoricalData(data);
}

export { processHistoricalData };
