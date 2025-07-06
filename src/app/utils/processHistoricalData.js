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

      let size = 6; // Default small size (aligned with future data)

      const hasStory = bird.story && bird.story.trim().length > 0;
      const hasSound = bird.sound && bird.sound.trim().length > 0;

      if (hasStory && hasSound) {
        size = 18; // Large size (aligned with future data)
      } else if (hasStory) {
        size = 10; // Middle size (aligned with future data)
      }
      // Small size (6) is already set as default

      return {
        x,
        y,
        name: bird.common_name || bird.species,
        species: bird.species,
        location: bird.archip?.replace(/\*$/, '').trim() || '-',
        year,
        story: bird.story,
        size: size, // Use calculated size
        status: 'EX', // Historical data are extinct
        tooltipStatus: bird.description,
        ext_date: bird.ext_date,
        common_name: bird.common_name,
        iucn_category_2021: bird.iucn_category_2021,
        description: bird.description,
        // fill and showOutline are now determined in FloatingDot based on size
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

export default processHistoricalData;
